<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'interviewee_name',
        'current_role',
        'organization',
        'client_type',
        'validates_hypothesis',
        'date',
        'location',
        'photo_path'
    ];

    public function responses()
    {
        return $this->hasMany(Response::class);
    }
}
