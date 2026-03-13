@extends('layouts.app')

@section('title', 'Welcome to My Portfolio')

@section('content')
<style>
    /* Specific styles for the home page */
    .hero-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap-reverse;
        gap: 30px;
    }

    .hero-text {
        flex: 1;
        min-width: 300px;
    }

    .hero-text h2 {
        border-bottom: none;
        font-size: 2.5em;
        margin-bottom: 10px;
        color: #333;
    }

    .hero-text .highlight {
        color: #4facfe;
    }

    .hero-image {
        flex: 1;
        display: flex;
        justify-content: center;
        min-width: 300px;
    }

    .hero-image img {
        width: 250px;
        height: 250px;
        object-fit: cover; /* keeps image from stretching */
        border-radius: 50%; /* makes image circular */
        border: 5px solid #4facfe;
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
</style>

<div class="hero-section">
    <div class="hero-text">
        <h2>Hello, I'm <span class="highlight">Sukanta | Sagnik</span>!</h2>
        <p style="font-size: 1.2em; color: #555;">
            Welcome to my very first portfolio website. I am an aspiring web developer passionate about learning how to build things on the internet.
        </p>
        <a href="/about" class="btn">Learn More About Me</a>
    </div>

    <div class="hero-image">
        <!-- Display the photo from public/images/my_photo.jpg -->
        <img src="{{ asset('images/my_photo.jpg') }}" alt="A picture of Sukanta" onerror="this.src='https://via.placeholder.com/250?text=My+Photo'">
    </div>
</div>

<div style="margin-top: 50px; text-align: center;">
    <h3>What I'm Learning</h3>
    <p>Right now, I am focusing on building a strong foundation in:</p>
    <div style="display: flex; justify-content: center; gap: 15px; margin-top: 20px; flex-wrap: wrap;">
        <span style="background: #e34c26; color: white; padding: 5px 15px; border-radius: 20px;">HTML</span>
        <span style="background: #264de4; color: white; padding: 5px 15px; border-radius: 20px;">CSS</span>
        <span style="background: #777bb3; color: white; padding: 5px 15px; border-radius: 20px;">PHP</span>
    </div>
</div>
@endsection
