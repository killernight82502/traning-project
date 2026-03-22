<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        
        $students = [
            [
                'id' => 'STU-001',
                'first_name' => 'subham',
                'last_name' => 'kundu',
                'email' => 'subham.kundu@email.com',
                'course' => 'Computer Science',
            ],
            [
                'id' => 'STU-002',
                'first_name' => 'Sagnik ',
                'last_name' => 'Bhattacherjee',
                'email' => 'sukanta@chakraborty.com',
                'course' => 'Mathematics',
            ],
        ];

        return view('student-list', compact('students'));
    }

    public function create()
    {
        
        $courses = ['Computer Science', 'Mathematics', 'Physics'];

        return view('add-student', compact('courses'));
    }

    public function store(Request $request)
    {
        

        return redirect()->route('students.index');
    }

    public function edit(string $id)
    {
        
        $student = [
            'id' => $id,
            'first_name' => 'subham',
            'last_name' => 'kundu',
            'email' => 'subham.kundu@email.com',
            'phone' => '0987654321',
            'course' => 'Computer Science',
            'status' => 'active',
            'address' => 'Siliguri, West Bengal, India',
        ];

        $courses = ['Computer Science', 'Mathematics', 'Physics'];

        return view('edit-student', compact('student', 'courses'));
    }

    public function update(Request $request, string $id)
    {
        

        return redirect()->route('students.index');
    }
}
