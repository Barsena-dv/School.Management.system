// ─── Field-level validators ──────────────────────────────────────────────────

export const required = (value, fieldName = 'This field') =>
    !value || !String(value).trim() ? `${fieldName} is required` : null

export const minLength = (value, min, fieldName = 'This field') =>
    value && value.length < min ? `${fieldName} must be at least ${min} characters` : null

export const maxLength = (value, max, fieldName = 'This field') =>
    value && value.length > max ? `${fieldName} must be at most ${max} characters` : null

export const isEmail = (value) =>
    value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter a valid email address' : null

// ─── Form-level validate runner ──────────────────────────────────────────────
// Usage:
//   const errors = validate(formData, {
//     email:    [required, isEmail],
//     password: [(v) => required(v, 'Password'), (v) => minLength(v, 6, 'Password')],
//   })
//   if (Object.keys(errors).length) { ... }

export const validate = (data, rules) => {
    const errors = {}
    Object.entries(rules).forEach(([field, fieldRules]) => {
        for (const rule of fieldRules) {
            const error = rule(data[field])
            if (error) { errors[field] = error; break }
        }
    })
    return errors
}

// ─── Pre-built form validators ───────────────────────────────────────────────

export const loginValidators = {
    email: [(v) => required(v, 'Email'), isEmail],
    password: [(v) => required(v, 'Password')],
}

export const registerValidators = {
    name: [(v) => required(v, 'Name'), (v) => minLength(v, 2, 'Name')],
    email: [(v) => required(v, 'Email'), isEmail],
    password: [(v) => required(v, 'Password'), (v) => minLength(v, 6, 'Password')],
}
