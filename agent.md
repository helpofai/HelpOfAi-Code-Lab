# Agent Guidelines

## Database Migrations
CRITICAL: Whenever a new database migration file is created, or an existing one is modified, you MUST use "if" logic to ensure idempotency. 

Live environments often have partial schemas or manual modifications that will crash standard Laravel migrations.

### Creating Tables
Always check if the table exists before creating it:
```php
if (!Schema::hasTable('table_name')) {
    Schema::create('table_name', function (Blueprint $table) {
        $table->id();
        // ...
    });
}
```

### Adding Columns
Always check if the column exists before adding it, and NEVER use `->after('column')` chaining unless absolutely guaranteed to exist:
```php
Schema::table('users', function (Blueprint $table) {
    if (!Schema::hasColumn('users', 'new_column')) {
        $table->string('new_column')->nullable();
    }
});
```

### Foreign Keys
Avoid strict DB-level foreign key constraints (`->constrained()`) on live servers with mismatched storage engines (e.g., MyISAM vs InnoDB) or legacy schemas, as this throws `errno 150`. Instead, define the relationship at the Eloquent Model level and use raw columns in migrations:
```php
// Do not do this:
// $table->foreignId('user_id')->constrained()->cascadeOnDelete();

// Do this instead:
$table->unsignedBigInteger('user_id');
$table->index('user_id');
```

## Over-The-Air (OTA) Update Protocol
CRITICAL: The production environment updates itself automatically via `UpdateController.php` using `git reset --hard origin/main`. It parses `.env.example` to inject new variables and determine the latest `APP_VERSION`. 

When instructed to push a new update or patch, you MUST execute the following pipeline in exact order:

1. **Write Code**: Modify the necessary PHP/React/Config files.
2. **Migrations**: Create NEW migrations for any database changes (Do NOT edit old migrations). ALWAYS use `Schema::hasTable` and `Schema::hasColumn` conditional checks.
3. **Environment Setup (.env.example)**: If new environment variables are needed, append them to `.env.example`. **CRITICAL**: You MUST bump `APP_VERSION` in `.env.example` (e.g., from 1.16.0 to 1.17.0).
4. **Compile Frontend**: Run `npm run build` locally to compile the React assets into `public/build/`.
5. **Changelog**: Update `changelog.md` tracking the new version and its changes.
6. **Deploy**: `git add .`, `git commit`, and `git push origin main`.

The production server will detect the push, run the automated snapshot, perform the `git reset`, intelligently migrate the `.env` schema, and execute `php artisan migrate --force`.
