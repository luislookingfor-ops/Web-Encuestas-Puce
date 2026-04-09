<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    use HasFactory;

    protected $fillable = [
        'interview_id',
        'question_id',
        'literal_response',
        'learning_insight'
    ];

    public function interview()
    {
        return $this->belongsTo(Interview::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
