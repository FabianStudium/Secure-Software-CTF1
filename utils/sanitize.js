// This sanitization function handles all SQL injection techniques I know of, surely this should be enough
function sanitizeInput(input) {
    // Check if input is undefined or null
    if (input == null) {
        return { sanitized: '', errorMessages: ['Input is undefined or null'] };
    }

    let sanitized = input;
    let errorMessages = [];  
    
    // Remove all SQL injection patterns I know of
    const patterns = [
        /' OR ''='/gi,  // Matches ' OR ''='
        /' OR \d+=''/gi, // Matches ' OR [number]=''
        /' OR '.*?'='.*?'/gi, // Matches ' OR '[any_string]'='[any_string]', using non-greedy matching
        /' OR '[^']*'='[^']*/gi, // Matches ' OR '[any_characters_except_single_quote]'='[any_characters_except_single_quote]
        /' OR '[^']*'='[^']*'/gi, // Matches ' OR '[any_characters_except_single_quote]'='[any_characters_except_single_quote]'
    ];
  
    patterns.forEach(pattern => {
        if (pattern.test(sanitized)) {
            errorMessages.push(`Disallowed pattern found: ${pattern}`);
            sanitized = sanitized.replace(pattern, '');
        }
    });
  
    // Remove important SQL keywords, case-insensitively
    const keywords = ['select', 'drop', 'insert', 'delete', 'union', 'join', 'and', 'or'];
    keywords.forEach(keyword => {
        const regex = new RegExp('\\b' + keyword + '\\b', 'gi');
        if (regex.test(sanitized)) {
            errorMessages.push(`Disallowed keyword found: ${keyword}`);
            sanitized = sanitized.replace(regex, '');
        }
    });
  
    // Return sanitized input and any error messages
    return { sanitized, errorMessages };
}
  
module.exports = sanitizeInput;
  