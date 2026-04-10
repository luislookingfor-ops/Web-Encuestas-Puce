<?php

define('LARAVEL_START', microtime(true));

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

// 1. Run Migrations
echo "Running Migrations...\n";
$status = $kernel->handle(
    $input = new Symfony\Component\Console\Input\ArgvInput(['artisan', 'migrate', '--force']), // <-- ¡ASEGÚRATE QUE TENGA EL --FORCE!
    new Symfony\Component\Console\Output\ConsoleOutput
);

// 2. Seed Admin User
echo "Seeding Admin User...\n";
$adminEmail = 'admin@encuestas.com';
$adminUser = \App\Models\User::where('email', $adminEmail)->first();

if (!$adminUser) {
    \App\Models\User::create([
        'name' => 'Administrator',
        'email' => $adminEmail,
        'password' => \Illuminate\Support\Facades\Hash::make('encuestas123')
    ]);
    echo "Admin user created: $adminEmail / encuestas123\n";
} else {
    $adminUser->password = \Illuminate\Support\Facades\Hash::make('encuestas123');
    $adminUser->save();
    echo "Admin user updated: $adminEmail / encuestas123\n";
}

// 3. Seed Default Questions
echo "Seeding Default Questions...\n";
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

$kernel->terminate($input, $status);
echo "Database initialized successfully!\n";
