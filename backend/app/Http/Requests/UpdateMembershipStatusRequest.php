<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMembershipStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:pending,active,expired',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Membership status is required.',
            'status.in' => 'Status must be pending, active, or expired.',
        ];
    }
}