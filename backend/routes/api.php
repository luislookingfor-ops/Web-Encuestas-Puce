<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\InterviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::get('/questions', [QuestionController::class, 'index']);

Route::post('/interviews', [InterviewController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::apiResource('questions', QuestionController::class)->except(['index']);
    
    Route::get('/interviews', [InterviewController::class, 'index']);
    Route::get('/interviews/{interview}', [InterviewController::class, 'show']);
    Route::put('/interviews/{interview}', [InterviewController::class, 'update']);
    Route::get('/interviews/{interview}/pdf', [InterviewController::class, 'generatePDF']);
    Route::delete('/interviews/{interview}', [InterviewController::class, 'destroy']);
});
