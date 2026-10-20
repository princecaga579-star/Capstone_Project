<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMembershipRequest;
use App\Http\Requests\UpdateMembershipRequest;
use App\Http\Requests\UpdateMembershipStatusRequest;
use App\Http\Resources\MembershipResource;
use App\Models\Membership;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    public function index(Request $request)
    {
        $query = Membership::with('user');

        // Search by membership type or member name
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('membership_type', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $memberships = $query->latest()->paginate(10);

        return MembershipResource::collection($memberships);
    }

    public function store(StoreMembershipRequest $request)
    {
        $membership = Membership::create($request->validated());

        return response()->json([
            'message' => 'Membership created successfully.',
            'membership' => new MembershipResource(
                $membership->load('user')
            ),
        ], 201);
    }

    public function show(string $id)
    {
        $membership = Membership::with('user')->findOrFail($id);

        return new MembershipResource($membership);
    }

    public function update(UpdateMembershipRequest $request, string $id)
    {
        $membership = Membership::findOrFail($id);

        $membership->update($request->validated());

        return response()->json([
            'message' => 'Membership updated successfully.',
            'membership' => new MembershipResource(
                $membership->load('user')
            ),
        ]);
    }

    public function updateStatus(
        UpdateMembershipStatusRequest $request,
        string $id
    ) {
        $membership = Membership::findOrFail($id);

        $membership->update([
            'status' => $request->validated()['status'],
        ]);

        return response()->json([
            'message' => 'Membership status updated successfully.',
            'membership' => new MembershipResource(
                $membership->load('user')
            ),
        ]);
    }


    public function destroy(string $id)
    {
        $membership = Membership::findOrFail($id);

        $membership->delete();

        return response()->json([
            'message' => 'Membership deleted successfully.',
        ]);
    }
}