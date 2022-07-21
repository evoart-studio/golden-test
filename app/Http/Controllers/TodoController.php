<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TodoController extends Controller
{
    public function index(): JsonResponse
    {
        $todos = Auth::user()->todos;
        return response()->json(["status" => "success", "error" => false, "count" => count($todos), "todos" => $todos],200);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            "title" => "required|min:3|unique:todos,title|regex:/^[a-zA-Z]{1}/",
            "description" => "required|regex:/^[a-zA-Z]{1}/",
            "user_id" => "required|numeric"
        ]);

        if($validator->fails()) {
            return $this->validationErrors($validator->errors());
        }

        try {
            $todo = Todo::create([
                "title" => $request->title,
                "description" => $request->description,
                "user_id" => $request->user_id,
                "author_id" => Auth::user()->id
            ]);
            return response()->json(["status" => "success", "error" => false, "message" => "Задача создана."], 201);
        }
        catch(Exception $exception) {
            return response()->json(["status" => "failed", "error" => $exception->getMessage()], 404);
        }
    }

    public function show($view): JsonResponse
    {
        if( $view == 'from' ) {
            $todos = Auth::user()->tasks;
        } else if( $view == 'for' ) {
            $todos = Auth::user()->todos;
        } else {
            $todos = Todo::all();
        }

        return response()->json(["status" => "success", "error" => false, "count" => count($todos), "todos" => $todos],200);
    }

    public function update($id): JsonResponse
    {
        $todo = Todo::find($id);

        if($todo) {
            $todo->update(['completed' => true]);
            return response()->json(["status" => "success", "error" => false, "message" => "Готово! Задача отмечена как выполненная."], 201);
        }
        return response()->json(["status" => "failed", "error" => true, "message" => "Ошибка, задача не найдена."], 404);
    }

    public function destroy($id): JsonResponse
    {
        $todo = Todo::find($id);

        if($todo) {
            $todo->delete();
            return response()->json(["status" => "success", "error" => false, "message" => "Задание успешно удалено."], 200);
        }
        return response()->json(["status" => "failed", "error" => true, "message" => "Задание не найдено."], 404);
    }
}
