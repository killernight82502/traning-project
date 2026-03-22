<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AdminController extends Controller
{
    public function showLoginForm()
    {
        return view('login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return redirect()->route('dashboard');
        }

        
        // the logic for deciding which error message to show depending on the mistake made the person while entering the credentials into the login form 

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            // Email not found
            return back()
                ->withErrors([
                    'email' => 'This email address is not registered.',
                ])
                ->onlyInput('email');
        }

        // If email is correct then password error message is displayed for the user
        return back()
            ->withErrors([
                'password' => 'The password you entered is incorrect.',
            ])
            ->onlyInput('email');
    }

    public function showRegistrationForm()
    {
        return view('registration');
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', 'min:6'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    public function dashboard()
    {
        
        return view('dashboard');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}

