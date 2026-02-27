const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Student = require('../models/student.model');
const StudentSubject = require('../models/studentSubject.model');
const Attendance = require('../models/attendance.model');
const Mark = require('../models/mark.model');
const Submission = require('../models/submission.model');
const User = require('../models/user.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student_dashboard';

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB for migration...');

        const collections = [
            { model: StudentSubject, name: 'StudentSubject' },
            { model: Attendance, name: 'Attendance' },
            { model: Mark, name: 'Mark' },
            { model: Submission, name: 'Submission' }
        ];

        for (const { model, name } of collections) {
            console.log(`\nChecking ${name} collection...`);
            const docs = await model.find({});
            let convertedCount = 0;
            let totalChecked = 0;

            for (const doc of docs) {
                totalChecked++;
                // Check if the student ID points to a User instead of a Student
                // We do this by checking if a User exists with this ID
                const isUser = await User.exists({ _id: doc.student });

                if (isUser) {
                    // This is a legacy User ID reference. Find the corresponding Student profile.
                    const studentProfile = await Student.findOne({ user: doc.student });

                    if (studentProfile) {
                        // Use updateOne to bypass unrelated validation errors on legacy data
                        await model.updateOne(
                            { _id: doc._id },
                            { $set: { student: studentProfile._id } }
                        );
                        convertedCount++;
                        console.log(`[${name}] Converted User ID ${doc.student} to Student ID ${studentProfile._id} for doc ${doc._id}`);
                    } else {
                        console.warn(`[${name}] WARNING: Document ${doc._id} references User ${doc.student} but no Student profile exists!`);
                    }
                }
            }
            console.log(`Finished ${name}. Checked ${totalChecked}, Converted ${convertedCount} records.`);
        }

        console.log('\nMigration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
