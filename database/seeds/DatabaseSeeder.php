<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserSeeder::class);
        $this->call(CompetitionSeeder::class);
        $this->call(TeamSeeder::class);
        $this->call(PassportClientSeeder::class);
    }
}
