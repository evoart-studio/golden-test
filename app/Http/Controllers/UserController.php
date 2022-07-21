<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class UserController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "first_name" => "required",
            "last_name" => "required",
            "email" => "required|email|unique:users,email",
            "password" => "required|min:3|same:password_confirmation",
            "password_confirmation" => "required"
        ]);

        if($validator->fails()) {
            return $this->validationErrors($validator->errors());
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'full_name' => $request->first_name . " ".$request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        return response()->json(["status" => "success", "error" => false, "message" => "Поздравляем, вы успешно зарегистрировались"], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "email" => "required|email",
            "password" => "required|min:3"
        ]);

        if($validator->fails()) {
            return $this->validationErrors($validator->errors());
        }

        try {
            if(Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                $user = Auth::user();
                $token = $user->createToken('token')->accessToken;
                return response()->json(
                    [
                        "status" => "success",
                        "error" => false,
                        "message" => "Вы успешно вошли в свой аккаунт.",
                        "user_id" => $user->id,
                        "token" => $token,
                    ]
                );
            }
            return response()->json(["status" => "failed", "message" => "Ошибка, неверные данные."], 200);
        }
        catch(Exception $e) {
            return response()->json(["status" => "failed", "message" => $e->getMessage()], 200);
        }
    }

    public function user(): JsonResponse
    {
        try {
            $user = Auth::user();
            return response()->json(["status" => "success", "error" => false, "data" => $user], 200);
        }
        catch(NotFoundHttpException $exception) {
            return response()->json(["status" => "failed", "error" => $exception], 200);
        }
    }

    public function users(): JsonResponse
    {
        if(Auth::check()) {
            $users = User::all();
            return response()->json(["status" => "success", "error" => false, "users" => $users], 200);
        }
        return response()->json(["status" => "failed", "error" => true, "message" => "Ошибка доступа."], 401);
    }

    public function logout(): JsonResponse
    {
        if(Auth::check()) {
            Auth::user()->token()->revoke();
            return response()->json(["status" => "success", "error" => false, "message" => "Успех! Вы вышли из аккаунта."], 200);
        }
        return response()->json(["status" => "failed", "error" => true, "message" => "Ошибка! Вы уже вышли из аккаунта."], 200);
    }
}
