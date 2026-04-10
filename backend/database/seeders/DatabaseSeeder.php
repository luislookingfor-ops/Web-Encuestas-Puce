<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Admin User
        $adminEmail = 'admin@encuestas.com';
        $adminUser = \App\Models\User::where('email', $adminEmail)->first();

        if (!$adminUser) {
            \App\Models\User::create([
                'name' => 'Administrator',
                'email' => $adminEmail,
                'password' => \Illuminate\Support\Facades\Hash::make('encuestas123')
            ]);
        } else {
            $adminUser->password = \Illuminate\Support\Facades\Hash::make('encuestas123');
            $adminUser->save();
        }

        // 2. Seed Default Questions
        $defaultQuestions = [
            '¿Cuál es su mayor dolor en el proceso actual?',
            '¿Cómo soluciona ese problema hoy en día?',
            '¿Estaría dispuesto a pagar por una solución automática?'
        ];

        foreach ($defaultQuestions as $idx => $text) {
            if (!\App\Models\Question::where('question_text', $text)->exists()) {
                \App\Models\Question::create([
                    'question_text' => $text,
                    'sort_order' => $idx
                ]);
            }
        }
    }
}
