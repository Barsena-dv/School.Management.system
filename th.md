[{
  name: "Physics",
  code: "PHY101",
  teacher: teacherId,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  name: "Mathematics",
  code: "MATH101",
  teacher: teacherId,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  name: "Computer Science",
  code: "CS101",
  teacher: teacherId,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  name: "Chemistry",
  code: "CHEM101",
  teacher: teacherId,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  name: "English",
  code: "ENG101",
  teacher: teacherId,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  name: "Hindi",
  code: "HIN101",
  teacher: teacherId,
  createdAt: new Date(),
  updatedAt: new Date()
},
{
  name: "Social Science",
  code: "SSC101",
  teacher: teacherId,
  createdAt: new Date(),
  updatedAt: new Date()
}]   

db.studentsubjects.insertMany([
  {
    student: studentId,
    subject: physics,
    enrolledAt: new Date()
  },
  {
    student: studentId,
    subject: math,
    enrolledAt: new Date()
  },
  {
    student: studentId,
    subject: computerScience,
    enrolledAt: new Date()
  },
  {
    student: studentId,
    subject: chemistry,
    enrolledAt: new Date()
  },
  {
    student: studentId,
    subject: english,
    enrolledAt: new Date()
  },
  {
    student: studentId,
    subject: hindi,
    enrolledAt: new Date()
  },
  {
    student: studentId,
    subject: socialScience,
    enrolledAt: new Date()
  }
])

"class": ObjectId("69a0481464f1bce8a54cb251")




{
  "name": "Mathematics",
  "class": ObjectId("69a0481464f1bce8a54cb251"),
  "teacher": ObjectId("699f1510ae5836229c9b484a"),
  "createdAt": { "$date": "2024-06-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-06-01T00:00:00.000Z" }
}

{
  "student": {$oid:"699f1563ae5836229c9b4850"}
  "subject": {$oid:"69a04a3864f1bce8a54cb260"},
  "createdAt": { "$date": "2024-06-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-06-01T00:00:00.000Z" }
}

{
  "user": { "$oid": "699f1563ae5836229c9b4850" },
  "class": { "$oid": "69a0481464f1bce8a54cb251" },
  "rollNumber": "10A-01",
  "createdAt": { "$date": "2024-06-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-06-01T00:00:00.000Z" }
}