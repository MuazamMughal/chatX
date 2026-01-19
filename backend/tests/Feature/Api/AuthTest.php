<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private const BASE_URL = '/api';

    public function test_user_can_register()
    {
        $response = $this->postJson(self::BASE_URL . '/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email'],
                'access_token',
                'token_type',
            ]);

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }

    public function test_user_can_login_with_correct_credentials()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $response = $this->postJson(self::BASE_URL . '/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'user' => ['id', 'name', 'email'],
            ]);
    }

    public function test_user_cannot_login_with_incorrect_credentials()
    {
        $user = User::factory()->create();

        $response = $this->postJson(self::BASE_URL . '/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_user_can_get_their_profile()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->getJson(self::BASE_URL . '/me');

        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    public function test_user_can_update_their_profile()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->putJson(self::BASE_URL . '/profile', [
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
    }

    public function test_user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->postJson(self::BASE_URL . '/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Successfully logged out']);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_user_can_refresh_token()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->postJson(self::BASE_URL . '/refresh');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'user' => ['id', 'name', 'email'],
            ]);
    }

    public function test_user_can_delete_account()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->deleteJson(self::BASE_URL . '/account');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Account deleted successfully']);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    public function test_password_reset_link_can_be_requested()
    {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this->postJson(self::BASE_URL . '/password/email', [
            'email' => $user->email,
        ]);

        $response->assertStatus(200)
            ->assertJson(['status' => 'We have emailed your password reset link.']);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_password_can_be_reset_with_valid_token()
    {
        Notification::fake();

        $user = User::factory()->create();

        // Generate a password reset token
        $token = Password::createToken($user);

        $response = $this->postJson(self::BASE_URL . '/password/reset', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertStatus(200)
            ->assertJson(['status' => 'Your password has been reset.']);

        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }

    public function test_email_verification_notification_can_be_sent()
    {
        $user = User::factory()->create(['email_verified_at' => null]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson(self::BASE_URL . '/email/verification-notification');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Verification link sent']);
    }

    public function test_email_cannot_be_verified_twice()
    {
        $user = User::factory()->create(['email_verified_at' => now()]);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson(self::BASE_URL . '/email/verification-notification');

        $response->assertStatus(409)
            ->assertJson(['message' => 'Email already verified']);
    }

    public function test_unauthenticated_user_cannot_access_protected_routes()
    {
        $response = $this->getJson(self::BASE_URL . '/me');
        $response->assertStatus(401);

        $response = $this->postJson(self::BASE_URL . '/logout');
        $response->assertStatus(401);

        $response = $this->putJson(self::BASE_URL . '/profile');
        $response->assertStatus(401);
    }

    public function test_registration_validation()
    {
        $response = $this->postJson(self::BASE_URL . '/register', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => '123',
            'password_confirmation' => 'different',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_login_validation()
    {
        $response = $this->postJson(self::BASE_URL . '/login', [
            'email' => '',
            'password' => '',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }
}
