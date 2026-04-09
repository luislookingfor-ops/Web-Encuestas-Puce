<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index()
    {
        return Question::orderBy('sort_order')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question_text' => 'required|string',
            'sort_order' => 'integer'
        ]);

        return Question::create($validated);
    }

    public function update(Request $request, Question $question)
    {
        $validated = $request->validate([
            'question_text' => 'string',
            'sort_order' => 'integer'
        ]);

        $question->update($validated);
        return $question;
    }

    public function destroy(Question $question)
    {
        $question->delete();
        return response()->noContent();
    }
}
