import React, { useState } from "react";
import {Search, Plus, Hash} from "lucide-react";
import UserCard from "../components/user-card/UserCard.jsx";
import { CreateUserModal } from "../components/modals/CreateUserModal.jsx";
//1
export default function ManageUsersPage(props) {
    const [users, setUsers] = useState(props.users || {});
    const [search, setSearch] = useState("");
    const [createOpen, setCreateOpen] = useState(false);

    const currentUser = props.users?.[props.user] || {};
    const currentType = (currentUser.type || currentUser.role || "").toLowerCase();
    const isPlainAdmin = currentType === "admin";

    const filteredUsers = Object.entries(users)
        .filter(([id, u]) => {

            // hide yourself
            if (id === props.user) return false;

            const targetRole = (u.type || u.role || "").toLowerCase();

            // plain admins cannot see system admins
            if (isPlainAdmin && targetRole === "system-admin") return false;

            return true;
        })

        .filter(([id, u]) =>
            (u["first-name"] + u["last-name"] + u["type"])
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        .map(([id, u]) => ({ id, ...u }));


    function handleDelete(id) {
        setUsers((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    }

    // receive form from modal and convert to dummy-user shape
    function handleCreateUser(form) {
        const id = form.username.trim();
        if (!id) return;

        const newUser = {
            "first-name": form.firstName,
            "last-name": form.lastName,
            "email": form.email,
            "phone": form.phone,
            "password": form.password,
            "type": form.type,               // respects admin/system admin rules
            "university": form.university,
            "gender": form.gender,
            "date-of-birth": form.dob,
        };

        setUsers((prev) => ({
            ...prev,
            [id]: newUser,
        }));
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
            {/* Header */}
            <header className="flex items-center justify-between max-w-5xl mx-auto px-2 pt-15 pb-4 gap-4">
                {/* Left: title + search */}
                <div className="flex items-center gap-4 flex-1">
                    <h1 className="font-[Gilroy-Black] text-[38px] md:text-[44px] leading-none">
                        Manage Users
                    </h1>

                    {/* Search circle */}
                    <div className="relative">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-[#E2E2E2] bg-white flex items-center justify-center shadow-sm">
                            <Search className="w-4 h-4 text-[#8C8C8C] font-[Gilroy-Medium]" />
                        </div>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search users"
                            className="absolute inset-0 opacity-0 cursor-text"
                        />
                    </div>
                </div>

                {/* Right: filter + create buttons */}
                <div className="flex items-center gap-3">
                    {/* Filter */}
                    <button
                        type="button"
                        className="flex items-center gap-2 border-2 border-[#4F6FFF]
                                    text-[#14113B] px-5 py-2 rounded-full font-[Gilroy-Medium]
                                    hover:bg-[#4F6FFF] hover:text-white transition"                    >
                        <Hash size={18} />
                        Filter
                    </button>

                    {/* Create new user */}
                    <button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#FFDF4F]
                                text-[#14113B]  rounded-[6px] font-[Gilroy-Medium]"
                    >
                        <Plus size={18} />
                        Create new user
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="px-5 md:px-10 py-8">
                <div className="mt-2">
                    {filteredUsers.length === 0 ? (
                        <p className="text-m text-gray-700 font-[Gilroy-Medium] mt-4">
                            No users match your search.
                        </p>
                    ) : (
                        filteredUsers.map((user) => (
                            <UserCard key={user.id} user={user} onDelete={handleDelete} />
                        ))
                    )}
                </div>
            </main>

            {/* Create User Modal */}
            <CreateUserModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreate={handleCreateUser}
                currentType={currentType}
            />

        </div>
    );
}
