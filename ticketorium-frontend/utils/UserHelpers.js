// src/utils/UserHelpers.js
export const assignUniHelper = (token, setUniversity, university) => {
    if (!token) return;
    setUniversity(university);
    localStorage.setItem("university", JSON.stringify(university));
};
