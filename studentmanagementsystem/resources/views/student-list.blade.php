<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student List - Student Management System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex">

    <!-- Sidebar (Simplified for standalone file) -->
    <aside class="w-64 bg-indigo-800 text-white flex flex-col hidden md:flex min-h-screen">
        <div class="p-6">
            <h2 class="text-2xl font-bold">SchoolAdmin</h2>
        </div>
        <nav class="flex-1 px-4 space-y-2">
            <a href="#" class="block px-4 py-3 hover:bg-indigo-700 rounded-lg font-medium transition-colors">Dashboard</a>
            <a href="#" class="block px-4 py-3 bg-indigo-900 rounded-lg font-medium">Students</a>
            <a href="#" class="block px-4 py-3 hover:bg-indigo-700 rounded-lg font-medium transition-colors">Courses</a>
        </nav>
    </aside>

    <main class="flex-1 overflow-y-auto">
        <header class="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
            <h1 class="text-xl font-semibold text-gray-800">Students</h1>
        </header>

        <div class="p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">All Students</h2>
                <a href="#" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    + Add New Student
                </a>
            </div>

            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="p-4 border-b border-gray-100 flex gap-4">
                    <input type="text" placeholder="Search students..." class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64">
                    <select class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option>All Courses</option>
                        <option>Computer Science</option>
                        <option>Mathematics</option>
                    </select>
                </div>
                <table class="w-full text-left">
                    <thead class="bg-gray-50 text-gray-600 text-sm">
                        <tr>
                            <th class="py-3 px-6 font-medium">Student ID</th>
                            <th class="py-3 px-6 font-medium">Name</th>
                            <th class="py-3 px-6 font-medium">Email</th>
                            <th class="py-3 px-6 font-medium">Course</th>
                            <th class="py-3 px-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-700 text-sm">
                        <tr class="border-b border-gray-50 hover:bg-gray-50">
                            <td class="py-3 px-6 font-medium text-gray-500">#STU-001</td>
                            <td class="py-3 px-6 font-medium">John Smith</td>
                            <td class="py-3 px-6">john.smith@example.com</td>
                            <td class="py-3 px-6">Computer Science</td>
                            <td class="py-3 px-6 text-right space-x-2">
                                <a href="#" class="text-indigo-600 hover:text-indigo-800 font-medium">Edit</a>
                                <button class="text-red-500 hover:text-red-700 font-medium">Delete</button>
                            </td>
                        </tr>
                        <tr class="border-b border-gray-50 hover:bg-gray-50">
                            <td class="py-3 px-6 font-medium text-gray-500">#STU-002</td>
                            <td class="py-3 px-6 font-medium">Emily Davis</td>
                            <td class="py-3 px-6">emily.d@example.com</td>
                            <td class="py-3 px-6">Mathematics</td>
                            <td class="py-3 px-6 text-right space-x-2">
                                <a href="#" class="text-indigo-600 hover:text-indigo-800 font-medium">Edit</a>
                                <button class="text-red-500 hover:text-red-700 font-medium">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="px-6 py-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
                    <span>Showing 1 to 2 of 1,245 students</span>
                    <div class="flex space-x-1">
                        <button class="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50">Prev</button>
                        <button class="px-3 py-1 border rounded bg-indigo-50 text-indigo-600">1</button>
                        <button class="px-3 py-1 border rounded hover:bg-gray-50">2</button>
                        <button class="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
