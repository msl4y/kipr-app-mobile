<?php

namespace KIPR\Http\Controllers;

use Carbon\Carbon;
use KIPR\Competition;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    /**
      * Get a Auth Tokens for judging.
      *
      * @param  \Illuminate\Http\Request  $request
      * @param  \KIPR\Competition $competition
      * @return \Illuminate\Http\Response
      */
    public function getAuthTokensForJudging(Request $request, Competition $competition)
    {
        // Get the Tokens
        $user = auth()->user();
        $tokens = $user->tokens()->get();
        $judging_tokens = [];
        foreach ($tokens as $token) {
            if (in_array("judging", $token->scopes)) {
                // If it is a fresh token, modify the expires_at to the competitions end date
                if ($token->expires_at == (new Carbon($token->created_at))->addYears(1)) {
                    $token->expires_at = $competition->end_date;
                    $token->save();
                }
                // Append the required Competition information to the token
                $token->competition = $competition;
                // Turn the tokens into QR Codes
                $token->image = "data:image/png;base64," . base64_encode(\QrCode::format('png')->size(500)->generate($token->id . '|' . $competition->id));
                array_push($judging_tokens, $token);
            }
        }
        return response()->json([
        'status' => 'success',
        'tokens' => collect($judging_tokens)
      ]);
    }

    /**
      * Get a Auth Tokens for sign in.
      *
      * @param  \Illuminate\Http\Request  $request
      * @param  \KIPR\Competition $competition
      * @return \Illuminate\Http\Response
      */
    public function getAuthTokensForSignIn(Request $request, Competition $competition)
    {
        // Get the Tokens
        $user = auth()->user();
        $tokens = $user->tokens()->get();
        $judging_tokens = [];
        foreach ($tokens as $token) {
            if (in_array("sign_in", $token->scopes)) {
                // If it is a fresh token, modify the expires_at to the competitions end date
                if ($token->expires_at == (new Carbon($token->created_at))->addYears(1)) {
                    $token->expires_at = $competition->end_date;
                    $token->save();
                }
                // Append the required Competition information to the token
                $token->competition = $competition;
                // Turn the tokens into QR Codes
                $token->image = "data:image/png;base64," . base64_encode(\QrCode::format('png')->size(500)->generate($token->id . '|' . $competition->id));
                array_push($judging_tokens, $token);
            }
        }
        return response()->json([
        'status' => 'success',
        'tokens' => collect($judging_tokens)
      ]);
    }
}
