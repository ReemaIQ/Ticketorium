import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

import UserCard from "../components/user-card/UserCard.jsx";
import { UserModal } from "../components/modals/UserModal.jsx";
import SearchBtn from "../components/search-button/SearchBtn.jsx"; // Updated import name recommended

library.add(fas, far, fab);

export default function ManageUsers(props) {
    const [users, setUsers] = useState(props.users || {});
    const [search, setSearch] = useState("");

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null); // null = create mode, object = edit mode

    const currentUser = props.users?.[props.user] || {};
    const currentType = (currentUser?.type || currentUser?.role || "").toLowerCase();
    const isRegularAdmin = currentType === "admin";

    // Filter Logic
    const filteredUsers = Object.entries(users)
        .filter(([id, u]) => {
            if (id === props.user) return false; // hide self

            const targetRole = (u.type || u.role || "").toLowerCase();

            // RULE 1: Regular admins cannot see system admins
            if (isRegularAdmin && targetRole === "system-admin") {
                return false;
            }

            // System admins see everyone (no specific return false needed)

            return true;
        })
        .filter(([id, u]) => {
            // Simple local search filter
            // If props.filterContent handles this, you might render that data instead.
            // Keeping this for immediate UI feedback based on your snippet.
            const searchStr = (u["first-name"] + " " + u["last-name"] + " " + u["type"]).toLowerCase();
            return searchStr.includes(search.toLowerCase());
        })
        .map(([id, u]) => ({ id, ...u }));

    /* ---------------- Handlers ---------------- */

    function handleDelete(id) {
        if(window.confirm("Are you sure you want to delete this user?")) {
            setUsers((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    }

    function handleEditClick(user) {
        setEditingUser(user);
        setModalOpen(true);
    }

    function handleCreateClick() {
        setEditingUser(null); // Reset to create mode
        setModalOpen(true);
    }

    // Unified Save Handler (Create or Update)
    function handleSaveUser(form) {
        const username = form.username.trim();

        // Map form (camelCase) back to data structure (kebab-case)
        const userObject = {
            "first-name": form.firstName,
            "last-name": form.lastName,
            "email": form.email,
            "phone": form.phone,
            "type": form.type,
            "university": form.university,
            "gender": form.gender,
            "date-of-birth": form.dob,
        };

        // Only update password if it was changed (it might be empty on edit)
        if (form.password) {
            userObject["password"] = form.password;
        } else if (editingUser && users[editingUser.id]) {
            // Keep old password if not provided during edit
            userObject["password"] = users[editingUser.id].password;
        }

        setUsers((prev) => {
            const next = { ...prev };

            // If editing and username changed, delete old key
            if (editingUser && editingUser.id !== username) {
                delete next[editingUser.id];
            }

            // Save new/updated user
            next[username] = userObject;
            return next;
        });

        setModalOpen(false);
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
            <header className="flex flex-col items-center justify-between gap-10 max-w-5xl mx-auto px-2 pt-15 pb-4">
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 flex-1">
                    <h1 className="font-[Gilroy-Black] text-[60px] leading-none w-full justify-start">
                        Manage Users
                    </h1>

                    <div className="flex w-full justify-end">
                        <button
                            type="button"
                            onClick={handleCreateClick}
                            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-color)] text-[var(--secondary-color)] rounded-[6px] font-[Gilroy-Medium]"
                        >
                            <Plus size={18} />
                            Create new user
                        </button>
                    </div>
                </div>

                {/*<div className="flex justify-center items-center w-full gap-3 px-5">*/}
                {/*    <button className="p-2 bg-[var(--filter-buttons)] rounded-full w-12 h-12 cursor-pointer hover:ring-4 ring-[rgba(0,0,0,0.1)] shrink-0">*/}
                {/*        <FontAwesomeIcon icon={"fa-solid fa-filter"} className="text-white" />*/}
                {/*    </button>*/}

                {/*    <SearchBtn*/}
                {/*        expandable={true}*/}
                {/*        filterFunc={(searchValue) => {*/}
                {/*            props.filterContent(*/}
                {/*                "search",*/}
                {/*                originalState.current,*/}
                {/*                setFilteredEvents,*/}
                {/*                "event",*/}
                {/*                searchValue,*/}
                {/*                {*/}
                {/*                    "list-type": "all-events",*/}
                {/*                    university: props.uni,*/}
                {/*                }*/}
                {/*            );*/}
                {/*        }}*/}
                {/*    />*/}

                {/*</div>*/}
            </header>

            <main className="px-5 md:px-10 py-8">
                <div className="mt-2">
                    {filteredUsers.length === 0 ? (
                        <p className="text-m text-gray-700 font-[Gilroy-Medium] mt-4">
                            No users match your search.
                        </p>
                    ) : (
                        filteredUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onDelete={handleDelete}
                                onEdit={() => handleEditClick(user)}
                            />
                        ))
                    )}
                </div>
            </main>

            {/* Reusable User Modal */}
            <UserModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveUser}
                currentType={currentType}
                initialData={editingUser}
                takenUsernames={Object.keys(users)}
            />
        </div>
    );
}