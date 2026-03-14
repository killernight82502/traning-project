<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Courses - Student Management System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex">

    <!-- Sidebar -->
    <aside class="w-64 bg-indigo-800 text-white flex flex-col hidden md:flex min-h-screen">
        <div class="p-6">
            <h2 class="text-2xl font-bold">SchoolAdmin</h2>
        </div>
        <nav class="flex-1 px-4 space-y-2">
            <a href="#" class="block px-4 py-3 hover:bg-indigo-700 rounded-lg font-medium transition-colors">Dashboard</a>
            <a href="#" class="block px-4 py-3 hover:bg-indigo-700 rounded-lg font-medium transition-colors">Students</a>
            <a href="#" class="block px-4 py-3 bg-indigo-900 rounded-lg font-medium">Courses</a>
        </nav>
    </aside>

    <main class="flex-1 overflow-y-auto">
        <header class="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
            <h1 class="text-xl font-semibold text-gray-800">Courses</h1>
        </header>

        <div class="p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">All Courses</h2>
                <a href="#" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
                    + Add New Course
                </a>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Course Card -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div class="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-lg font-bold text-gray-800">Computer Science</h3>
                            <span class="bg-blue-100 text-blue-700 py-1 px-2 rounded-full text-xs font-bold">CS101</span>
                        </div>
                        <p class="text-gray-500 text-sm mb-4">Introduction to programming, algorithms, and data structures.</p>
                        
                        <div class="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                            <span class="text-gray-600"><span class="font-bold text-gray-800">120</span> Enrolled</span>
                            <div class="space-x-2">
                                <button class="text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                                <button class="text-red-500 hover:text-red-700 font-medium">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Course Card -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div class="h-32 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-lg font-bold text-gray-800">Mathematics</h3>
                            <span class="bg-teal-100 text-teal-700 py-1 px-2 rounded-full text-xs font-bold">MATH201</span>
                        </div>
                        <p class="text-gray-500 text-sm mb-4">Calculus, linear algebra, and discrete mathematics essentials.</p>
                        
                        <div class="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                            <span class="text-gray-600"><span class="font-bold text-gray-800">85</span> Enrolled</span>
                            <div class="space-x-2">
                                <button class="text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                                <button class="text-red-500 hover:text-red-700 font-medium">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Course Card -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div class="h-32 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-lg font-bold text-gray-800">Physics</h3>
                            <span class="bg-orange-100 text-orange-700 py-1 px-2 rounded-full text-xs font-bold">PHY101</span>
                        </div>
                        <p class="text-gray-500 text-sm mb-4">Mechanics, thermodynamics, and electromagnetism fundamentals.</p>
                        
                        <div class="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                            <span class="text-gray-600"><span class="font-bold text-gray-800">64</span> Enrolled</span>
                            <div class="space-x-2">
                                <button class="text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                                <button class="text-red-500 hover:text-red-700 font-medium">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>
