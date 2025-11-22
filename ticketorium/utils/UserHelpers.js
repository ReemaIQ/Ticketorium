// src/utils/UserHelpers.js

export const checkIfEmailExists = (dummyUsersRef, email) => {
    for (const username in dummyUsersRef.current) {
        if (dummyUsersRef.current[username].email === email) {
            return true;
        }
    }
    return false;
};

export const checkIfPhoneExists = (dummyUsersRef, phone) => {
    for (const username in dummyUsersRef.current) {
        if (dummyUsersRef.current[username].phone === phone) {
            return true;
        }
    }
    return false;
};

export const checkIfUsernameExists = (dummyUsersRef, username) => {
    return username in dummyUsersRef.current;
};

export const checkUsernamePassword = (dummyUsersRef, username, password) => {
    if (username in dummyUsersRef.current) {
        return dummyUsersRef.current[username].password === password;
    }
    return false;
};

export const checkEmailPassword = (dummyUsersRef, email, password) => {
    for (const username in dummyUsersRef.current) {
        if (dummyUsersRef.current[username].email === email) {
            return dummyUsersRef.current[username].password === password;
        }
    }
    return false;
};

export const getUsernameFromEmail = (dummyUsersRef, email) => {
    for (const username in dummyUsersRef.current) {
        if (dummyUsersRef.current[username].email === email) {
            return username;
        }
    }
    return null;
};

export const addNewUser = (dummyUsersRef, data) => {
    const userObject = {
        "first-name": data["first-name"],
        "last-name": data["last-name"],
        email: data["email"],
        phone: data["phone-number"],
        password: data["password"],
        type: "visitor",
        university: null,
        gender: data["gender"],
        "date-of-birth": data["date-of-birth"],
    };

    dummyUsersRef.current[data["username"]] = userObject;
    localStorage.setItem("dummyUsers", JSON.stringify(dummyUsersRef.current));
};

export const assignUni = (dummyUsersRef, loggedInUser, university) => {
    if (!loggedInUser) return;
    dummyUsersRef.current[loggedInUser].university = university;
    localStorage.setItem("dummyUsers", JSON.stringify(dummyUsersRef.current));
};
