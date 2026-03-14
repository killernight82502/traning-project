<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Course - Student Management System</title>
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
            <div class="flex items-center space-x-2">
                <a href="#" class="text-gray-500 hover:text-indigo-600 transition-colors">Courses</a>
                <span class="text-gray-400">/</span>
                <h1 class="text-xl font-semibold text-gray-800">Add New Course</h1>
            </div>
        </header>

        <div class="p-8 max-w-3xl mx-auto">
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="px-8 py-6 border-b border-gray-100 text-lg font-semibold text-gray-800">
                    Course Information
                </div>

                <form action="{{ route('courses.store') }}" method="POST" class="p-8">
                    @csrf
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                        <input type="text" placeholder="e.g. Introduction to Programming" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" required>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                            <input type="text" placeholder="e.g. CS101" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono uppercase" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Duration (Months)</label>
                            <input type="number" min="1" placeholder="e.g. 6" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                        <input type="text" placeholder="e.g. Dr. Alan Turing" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
                        <textarea rows="4" placeholder="Brief outline of the course syllabus..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"></textarea>
                    </div>

                    <div class="mb-6 border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                        <svg class="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <span class="text-sm font-medium text-indigo-600 cursor-pointer hover:underline">Upload Course Thumbnail Image</span>
                        <span class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                        <input type="file" class="hidden">
                    </div>

                    <div class="flex justify-end space-x-4 border-t border-gray-100 pt-6">
                        <button type="button" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors">Save Course</button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</body>
</html>
