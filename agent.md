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
