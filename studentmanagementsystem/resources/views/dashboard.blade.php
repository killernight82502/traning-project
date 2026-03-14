<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Management System - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex">

    <!-- Sidebar -->
    <aside class="w-64 bg-indigo-800 text-white flex flex-col hidden md:flex">
        <div class="p-6">
            <h2 class="text-2xl font-bold">SchoolAdmin</h2>
        </div>
        <nav class="flex-1 px-4 space-y-2">
            <a href="#" class="block px-4 py-3 bg-indigo-900 rounded-lg font-medium">Dashboard</a>
            <a href="#" class="block px-4 py-3 hover:bg-indigo-700 rounded-lg font-medium transition-colors">Students</a>
            <a href="#" class="block px-4 py-3 hover:bg-indigo-700 rounded-lg font-medium transition-colors">Courses</a>
        </nav>
        <div class="p-4 border-t border-indigo-700">
            <a href="#" class="block px-4 py-2 hover:bg-indigo-700 rounded-lg font-medium transition-colors text-indigo-200">Logout</a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
        <!-- Header -->
        <header class="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
            <h1 class="text-xl font-semibold text-gray-800">Dashboard</h1>
            <div class="flex items-center space-x-4">
                <span class="text-gray-600 font-medium">Admin User</span>
                <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">A</div>
            </div>
        </header>

        <div class="p-8">
            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <!-- Total Students -->
                <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                    <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Students</h3>
                    <p class="text-3xl font-bold text-gray-800">1,245</p>
                </div>
                <!-- Total Courses -->
                <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                    <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Total Courses</h3>
                    <p class="text-3xl font-bold text-gray-800">42</p>
                </div>
                <!-- Other Stat -->
                <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                    <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Active Staff</h3>
                    <p class="text-3xl font-bold text-gray-800">86</p>
                </div>
            </div>

            <!-- Latest Students -->
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 class="text-lg font-semibold text-gray-800">Latest Students</h2>
                    <a href="#" class="text-indigo-600 text-sm font-medium hover:underline">View All</a>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                                <th class="py-3 px-6 font-medium">Name</th>
                                <th class="py-3 px-6 font-medium">Email</th>
                                <th class="py-3 px-6 font-medium">Enrolled Date</th>
                                <th class="py-3 px-6 font-medium">Course</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-700 text-sm">
                            <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td class="py-3 px-6 flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">JS</div>
                                    <span class="font-medium">John Smith</span>
                                </td>
                                <td class="py-3 px-6 text-gray-500">john.smith@example.com</td>
                                <td class="py-3 px-6">Oct 24, 2026</td>
                                <td class="py-3 px-6"><span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Computer Science</span></td>
                            </tr>
                            <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td class="py-3 px-6 flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-xs">ED</div>
                                    <span class="font-medium">Emily Davis</span>
                                </td>
                                <td class="py-3 px-6 text-gray-500">emily.d@example.com</td>
                                <td class="py-3 px-6">Oct 23, 2026</td>
                                <td class="py-3 px-6"><span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Mathematics</span></td>
                            </tr>
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="py-3 px-6 flex items-center gap-3">
                                    <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">MW</div>
                                    <span class="font-medium">Michael Wilson</span>
                                </td>
                                <td class="py-3 px-6 text-gray-500">m.wilson@example.com</td>
                                <td class="py-3 px-6">Oct 22, 2026</td>
                                <td class="py-3 px-6"><span class="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">Physics</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

</body>
</html>
