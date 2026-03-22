<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CoursesController extends Controller
{
    public function index()
    {
       
        $courses = [
            [
                'code' => 'CS101',
                'name' => 'Computer Science',
                'duration_months' => 6,
                'instructor' => 'Dr. Alan Turing',
            ],
            [
                'code' => 'MATH201',
                'name' => 'Mathematics',
                'duration_months' => 4,
                'instructor' => 'Dr. Ada Lovelace',
            ],
        ];

        return view('course-list', compact('courses'));
    }

    public function create()
    {
        return view('add-course');
    }

    public function store(Request $request)
    {
        

        return redirect()->route('courses.index');
    }
}
