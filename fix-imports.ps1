# Fix framer-motion and next-intl imports in all files

$files = @(
    "src\app\[locale]\(dashboard)\admin\notifications\add\page.tsx",
    "src\app\[locale]\(dashboard)\admin\users\page.tsx",
    "src\app\[locale]\(dashboard)\admin\users\add\page.tsx",
    "src\app\[locale]\(dashboard)\admin\users\[id]\edit\page.tsx",
    "src\app\[locale]\(dashboard)\employees\[id]\page.tsx",
    "src\app\[locale]\(dashboard)\products\add\page.tsx",
    "src\app\[locale]\(dashboard)\products\[id]\page.tsx",
    "src\app\[locale]\(dashboard)\products\[id]\edit\page.tsx"
)

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    # Replace next-intl import with custom hook
    $content = $content -replace "import \{ useTranslations \} from 'next-intl';", "import { useTranslations } from '@/hooks/useTranslations';"
    
    # Remove framer-motion import line
    $content = $content -replace "import \{ motion \} from 'framer-motion';\r?\n", ""
    
    # Replace motion.div with div and animate-fadeIn class
    $content = $content -replace '<motion\.div\s+initial=\{[^}]+\}\s+animate=\{[^}]+\}>', '<div class="animate-fadeIn">'
    $content = $content -replace '<motion\.div\s+initial=\{[^}]+\}\s+animate=\{[^}]+\}\s+className="([^"]+)">', '<div className="$1 animate-fadeIn">'
    $content = $content -replace '</motion\.div>', '</div>'
    
    Set-Content $file -Value $content -NoNewline
    Write-Host "Fixed: $file"
}

Write-Host "`nAll files fixed!"
