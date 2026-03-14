<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('login');
})->name('login');

Route::post('/login', function () {
    return redirect()->route('dashboard');
})->name('login.post');

Route::get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

Route::prefix('students')->name('students.')->group(function () {
    Route::get('/', function () {
        return view('student-list');
    })->name('index');

    Route::get('/add', function () {
        return view('add-student');
    })->name('create');

    Route::post('/add', function () {
        // Dummy insert logic
        return redirect()->route('students.index');
    })->name('store');

    Route::get('/edit', function () {
        return view('edit-student');
    })->name('edit');

    Route::post('/edit', function () {
        // Dummy update logic
        return redirect()->route('students.index');
    })->name('update');
});

Route::prefix('courses')->name('courses.')->group(function () {
    Route::get('/', function () {
        return view('course-list');
    })->name('index');

    Route::get('/add', function () {
        return view('add-course');
    })->name('create');

    Route::post('/add', function () {
        // Dummy insert logic
        return redirect()->route('courses.index');
    })->name('store');
});
