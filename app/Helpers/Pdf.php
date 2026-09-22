<?php
namespace App\Helpers;

class Pdf
{
    private string $content = '';
    private float $y = 0;
    private float $margin;
    private float $pageW;
    private float $pageH;
    private array $fonts = [];
    private int $fontId = 0;

    public function __construct()
    {
        $this->pageW = 595.28;
        $this->pageH = 841.89;
        $this->margin = 36;
        $this->y = $this->margin;
        $this->addFont('Helvetica', 'Helvetica');
        $this->addFont('Helvetica-Bold', 'Helvetica-Bold');
    }

    private function addFont(string $alias, string $base): void
    {
        $this->fontId++;
        $this->fonts[$alias] = ['id' => $this->fontId, 'base' => $base];
    }

    public function addPage(): void
    {
        $this->y = $this->margin;
    }

    private function emitText(string $text, float $x, float $y, string $font, float $size): void
    {
        $esc = $this->escape($text);
        $f = $this->fonts[$font] ?? $this->fonts['Helvetica'];
        $this->content .= sprintf("BT /F%d %.1f Tf %.2f %.2f Td (%s) Tj ET\n",
            $f['id'], $size, $x, $this->h($y), $esc);
    }

    private function h(float $y): float
    {
        return $this->pageH - $y;
    }

    private function escape(string $s): string
    {
        $s = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $s);
        return preg_replace('/[^\x20-\x7E\\(\\)]/', ' ', $s);
    }

    // ─── High-level API ────────────────────────────────────────

    public function title(string $text): void
    {
        $this->emitText($text, $this->margin, $this->y, 'Helvetica-Bold', 20);
        $this->y += 16;
    }

    public function subtitle(string $text): void
    {
        $this->emitText($text, $this->margin, $this->y, 'Helvetica', 10);
        $this->y += 12;
    }

    public function meta(string $label, string $value): void
    {
        $x = $this->margin;
        $this->emitText($label, $x, $this->y, 'Helvetica-Bold', 10);
        $x += $this->textWidth($label, 'Helvetica-Bold', 10) + 4;
        $this->emitText($value, $x, $this->y, 'Helvetica', 10);
        $this->y += 9;
    }

    private function textWidth(string $text, string $font, float $size): float
    {
        $avg = $font === 'Helvetica-Bold' ? 0.6 : 0.55;
        return strlen($text) * $size * $avg;
    }

    public function spacer(float $h = 6): void
    {
        $this->y += $h;
    }

    public function line(): void
    {
        $this->y += 4;
    }

    public function table(array $headers, array $rows, array $colWidths): void
    {
        $x = $this->margin;
        $rowH = 18;
        $colCount = count($headers);

        // Header row (bold)
        $cx = $x;
        for ($i = 0; $i < $colCount; $i++) {
            $this->emitText($headers[$i], $cx + 2, $this->y, 'Helvetica-Bold', 9);
            $cx += $colWidths[$i];
        }
        $this->y += $rowH;

        // Data rows
        foreach ($rows as $row) {
            $cx = $x;
            for ($i = 0; $i < $colCount; $i++) {
                $cell = (string)($row[$i] ?? '');
                $this->emitText($cell, $cx + 2, $this->y, 'Helvetica', 9);
                $cx += $colWidths[$i];
            }
            $this->y += $rowH;

            if ($this->y > $this->pageH - $this->margin - 40) {
                break;
            }
        }
    }

    public function summary(string $label, string $value): void
    {
        $this->y += 4;
        $this->emitText($label . ': ' . $value, $this->margin, $this->y, 'Helvetica-Bold', 11);
        $this->y += 14;
    }

    public function output(string $filename): never
    {
        $pdf = $this->build();
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Content-Length: ' . strlen($pdf));
        echo $pdf;
        exit;
    }

    private function build(): string
    {
        $objects = [];
        $num = 0;

        $objects[++$num] = "<< /Type /Catalog /Pages 2 0 R >>";
        $objects[++$num] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>";

        $fontRefs = [];
        foreach ($this->fonts as $alias => $f) {
            $fontRefs[] = "/F{$f['id']} {$f['id']} 0 R";
        }
        $objects[++$num] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {$this->pageW} {$this->pageH}] /Contents 4 0 R /Resources << /Font << " . implode(' ', $fontRefs) . " >> >> >>";

        $len = strlen($this->content);
        $objects[++$num] = "<< /Length $len >>\nstream\n$this->content\nendstream";

        foreach ($this->fonts as $alias => $f) {
            $objects[++$num] = "<< /Type /Font /Subtype /Type1 /BaseFont /{$f['base']} >>";
        }

        $output = "%PDF-1.4\n";
        $offsets = [];
        foreach ($objects as $n => $obj) {
            $offsets[$n] = strlen($output);
            $output .= "$n 0 obj\n$obj\nendobj\n";
        }

        $xref = strlen($output);
        $output .= "xref\n0 " . ($num + 1) . "\n0000000000 65535 f \n";
        for ($i = 1; $i <= $num; $i++) {
            $output .= sprintf("%010d 00000 n \n", $offsets[$i]);
        }
        $output .= "trailer\n<< /Size " . ($num + 1) . " /Root 1 0 R >>\nstartxref\n$xref\n%%EOF";

        return $output;
    }
}
