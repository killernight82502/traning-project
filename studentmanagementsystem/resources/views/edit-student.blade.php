<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Student - Student Management System</title>
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
            <a href="#" class="block px-4 py-3 bg-indigo-900 rounded-lg font-medium">Students</a>
            <a href="#" class="block px-4 py-3 hover:bg-indigo-700 rounded-lg font-medium transition-colors">Courses</a>
        </nav>
    </aside>

    <main class="flex-1 overflow-y-auto">
        <header class="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <a href="#" class="text-gray-500 hover:text-indigo-600 transition-colors">Students</a>
                <span class="text-gray-400">/</span>
                <h1 class="text-xl font-semibold text-gray-800">Edit Student</h1>
            </div>
        </header>

        <div class="p-8 max-w-4xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <span class="text-lg font-semibold text-gray-800">Edit Information - STU-001</span>
                    <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span>
                </div>

                <form action="{{ route('students.update') }}" method="POST" class="p-8">
                    @csrf
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input type="text" value="John" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input type="text" value="Smith" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" value="john.smith@example.com" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input type="tel" value="+1 (555) 123-4567" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                            <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                                <option>Computer Science</option>
                                <option>Mathematics</option>
                                <option>Physics</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="graduated">Graduated</option>
                            </select>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">123 College Ave, University Town, ST 12345</textarea>
                    </div>

                    <div class="flex justify-end space-x-4 border-t border-gray-100 pt-6">
                        <button type="button" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors">Update Student</button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</body>
</html>
