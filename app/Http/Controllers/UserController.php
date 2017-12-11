<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    public function index()
    {
        $users=User::all();
        return $users;
    }

    public function create()
    {
        return view('users.create');
    }

    public function store()
    {
        $newUser = new User;
        $newUser->UserEmail = request('email');
        $newUser->UserFirstName = request('firstName');
        $newUser->UserLastName = request('lastName');
        $newUser->UserPassword = Hash::make(request('pass'));
        $newUser->save();

        $user = User::where('UserEmail', request('email'))->first();
        return view('users.show', compact('user'));
    }

    public function show($id)
    {
        $user=User::find($id);
        return view('users.show',compact('user'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }
}
