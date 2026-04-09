<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\Response as InterviewResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class InterviewController extends Controller
{
    public function index()
    {
        return Interview::with('responses.question')->orderBy('created_at', 'desc')->get();
    }

    public function show(Interview $interview)
    {
        return $interview->load('responses.question');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'interviewee_name' => 'required|string',
            'current_role' => 'nullable|string',
            'organization' => 'nullable|string',
            'client_type' => 'nullable|string',
            'validates_hypothesis' => 'boolean',
            'date' => 'required|date',
            'location' => 'nullable|string',
            'photo' => 'required|image|max:5120', // 5MB
            'responses' => 'required|string' // JSON string
        ]);

        $path = $request->file('photo')->store('interviewees', 'public');

        $interview = Interview::create([
            'interviewee_name' => $validated['interviewee_name'],
            'current_role' => $validated['current_role'],
            'organization' => $validated['organization'],
            'client_type' => $validated['client_type'],
            'validates_hypothesis' => $validated['validates_hypothesis'],
            'date' => $validated['date'],
            'location' => $validated['location'],
            'photo_path' => $path
        ]);

        $responses = json_decode($validated['responses'], true);
        foreach ($responses as $resp) {
            InterviewResponse::create([
                'interview_id' => $interview->id,
                'question_id' => $resp['question_id'],
                'literal_response' => $resp['literal_response'],
                'learning_insight' => $resp['learning_insight']
            ]);
        }

        return $interview->load('responses');
    }

    public function update(Request $request, Interview $interview)
    {
        $validated = $request->validate([
            'interviewee_name' => 'required|string',
            'current_role' => 'nullable|string',
            'organization' => 'nullable|string',
            'client_type' => 'nullable|string',
            'validates_hypothesis' => 'boolean',
            'date' => 'required|date',
            'location' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
            'responses' => 'required|string'
        ]);

        $updateData = [
            'interviewee_name' => $validated['interviewee_name'],
            'current_role' => $validated['current_role'],
            'organization' => $validated['organization'],
            'client_type' => $validated['client_type'],
            'validates_hypothesis' => $validated['validates_hypothesis'],
            'date' => $validated['date'],
            'location' => $validated['location'],
        ];

        if ($request->hasFile('photo')) {
            if ($interview->photo_path) {
                Storage::disk('public')->delete($interview->photo_path);
            }
            $updateData['photo_path'] = $request->file('photo')->store('interviewees', 'public');
        }

        $interview->update($updateData);

        $responses = json_decode($validated['responses'], true);
        foreach ($responses as $resp) {
            InterviewResponse::updateOrCreate(
                ['interview_id' => $interview->id, 'question_id' => $resp['question_id']],
                [
                    'literal_response' => $resp['literal_response'],
                    'learning_insight' => $resp['learning_insight']
                ]
            );
        }

        return $interview->load('responses');
    }

    public function generatePDF(Interview $interview)
    {
        $interview->load('responses.question');
        $pdf = Pdf::loadView('pdf.interview', compact('interview'));
        return $pdf->download("entrevista_{$interview->id}.pdf");
    }

    public function destroy(Interview $interview)
    {
        if ($interview->photo_path) {
            Storage::disk('public')->delete($interview->photo_path);
        }
        $interview->delete();
        return response()->json(['message' => 'Entrevista eliminada con éxito']);
    }
}
