<?php
/**
 * Input validation helper.
 */
namespace App\Helpers;

class Validator
{
    private array $errors = [];
    private array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * Create a validator instance.
     */
    public static function make(array $data): self
    {
        return new self($data);
    }

    /**
     * Field is required and must not be empty.
     */
    public function required(string $field, ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (!isset($this->data[$field]) || (is_string($this->data[$field]) && trim($this->data[$field]) === '')) {
            $this->errors[$field][] = "{$label} is required.";
        }
        return $this;
    }

    /**
     * Must be a valid email.
     */
    public function email(string $field, ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (isset($this->data[$field]) && trim($this->data[$field]) !== '') {
            if (!filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
                $this->errors[$field][] = "{$label} must be a valid email address.";
            }
        }
        return $this;
    }

    /**
     * Minimum string length.
     */
    public function min(string $field, int $length, ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (isset($this->data[$field]) && is_string($this->data[$field])) {
            if (mb_strlen(trim($this->data[$field])) < $length) {
                $this->errors[$field][] = "{$label} must be at least {$length} characters.";
            }
        }
        return $this;
    }

    /**
     * Maximum string length.
     */
    public function max(string $field, int $length, ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (isset($this->data[$field]) && is_string($this->data[$field])) {
            if (mb_strlen(trim($this->data[$field])) > $length) {
                $this->errors[$field][] = "{$label} must not exceed {$length} characters.";
            }
        }
        return $this;
    }

    /**
     * Must match a regex pattern.
     */
    public function pattern(string $field, string $pattern, string $message, ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (isset($this->data[$field]) && trim($this->data[$field]) !== '') {
            if (!preg_match($pattern, $this->data[$field])) {
                $this->errors[$field][] = $message;
            }
        }
        return $this;
    }

    /**
     * Must be one of the allowed values.
     */
    public function in(string $field, array $allowed, ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (isset($this->data[$field]) && trim($this->data[$field]) !== '') {
            if (!in_array($this->data[$field], $allowed, true)) {
                $this->errors[$field][] = "{$label} must be one of: " . implode(', ', $allowed) . '.';
            }
        }
        return $this;
    }

    /**
     * Must be a valid URL.
     */
    public function url(string $field, ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (isset($this->data[$field]) && trim($this->data[$field]) !== '') {
            if (!filter_var($this->data[$field], FILTER_VALIDATE_URL)) {
                $this->errors[$field][] = "{$label} must be a valid URL.";
            }
        }
        return $this;
    }

    /**
     * Must be numeric.
     */
    public function numeric(string $field, ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (isset($this->data[$field]) && trim($this->data[$field]) !== '') {
            if (!is_numeric($this->data[$field])) {
                $this->errors[$field][] = "{$label} must be a number.";
            }
        }
        return $this;
    }

    /**
     * Must be an integer.
     */
    public function integer(string $field, ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (isset($this->data[$field]) && trim($this->data[$field]) !== '') {
            if (!filter_var($this->data[$field], FILTER_VALIDATE_INT)) {
                $this->errors[$field][] = "{$label} must be an integer.";
            }
        }
        return $this;
    }

    /**
     * Must be a valid date.
     */
    public function date(string $field, ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (isset($this->data[$field]) && trim($this->data[$field]) !== '') {
            if (!strtotime($this->data[$field])) {
                $this->errors[$field][] = "{$label} must be a valid date.";
            }
        }
        return $this;
    }

    /**
     * Must match another field (confirmation).
     */
    public function confirmed(string $field, string $confirmationField = 'password_confirmation', ?string $label = null): self
    {
        $label = $label ?? str_replace('_', ' ', $field);
        if (isset($this->data[$field]) && isset($this->data[$confirmationField])) {
            if ($this->data[$field] !== $this->data[$confirmationField]) {
                $this->errors[$field][] = "{$label} confirmation does not match.";
            }
        }
        return $this;
    }

    /**
     * Custom rule via callback.
     */
    public function custom(string $field, callable $callback, string $message): self
    {
        if (isset($this->data[$field])) {
            if (!$callback($this->data[$field])) {
                $this->errors[$field][] = $message;
            }
        }
        return $this;
    }

    /**
     * Returns true if validation passes.
     */
    public function passes(): bool
    {
        return empty($this->errors);
    }

    /**
     * Returns validation errors.
     */
    public function errors(): array
    {
        return $this->errors;
    }

    /**
     * Returns the first error message.
     */
    public function firstError(): string
    {
        foreach ($this->errors as $field => $msgs) {
            return $msgs[0];
        }
        return '';
    }

    /**
     * Returns validated data (only fields that were checked).
     */
    public function validated(): array
    {
        $result = [];
        foreach ($this->errors as $field => $msgs) {
            if (isset($this->data[$field])) {
                $result[$field] = $this->data[$field];
            }
        }
        // Also include fields that had no errors
        foreach ($this->data as $key => $value) {
            if (!isset($result[$key])) {
                $result[$key] = $value;
            }
        }
        return $result;
    }
}
