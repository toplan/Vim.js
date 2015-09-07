/**
 * Created by top on 15-9-6.
 */

exports.ready = function(router){
    //0:move to current line head
    router.code(48, '0').action(0, 'moveToCurrentLineHead');
    //&:move to current line tail
    router.code(52, '4').action('shift_4', 'moveToCurrentLineTail');
    //append
    router.code(65, 'a').action('a', 'append').action('A', 'appendLineTail');
    //insert
    router.code(73, 'i').action('i', 'insert').action('I', 'insertLineHead');
    //new line
    router.code(79, 'o').action('o', 'appendNewLine').action('O', 'insertNewLine').record(true);
    //replace
    router.code(82, 'r').action('r', 'replaceChar');
    //down
    router.code(13, 'enter').action('enter', 'selectNextLine');
    router.code(74, 'j').action('j', 'selectNextLine');
    //up
    router.code(75, 'k').action('k', 'selectPrevLine');
    //left
    router.code(72, 'h').action('h', 'selectPrevCharacter');
    //right
    router.code(76, 'l').action('l', 'selectNextCharacter');
    //paste
    router.code(80, 'p').action('p', 'pasteAfter').action('P', 'pasteBefore').record(true);
    //back
    router.code(85, 'u').action('u', 'backToHistory');
    //copy char
    router.code(89, 'y').action('y', 'copyChar').mode('visual_mode');
    router.code('89_89', 'yy').action('yy', 'copyCurrentLine');
    //v
    router.code(86, 'v').action('v', 'switchModeToVisual').action('V', 'switchModeToVisual');
    //delete character
    router.code(88, 'x').action('x', 'delCharAfter').action('X', 'delCharBefore').record(true);
    //delete selected char in visual mode
    router.code(68, 'd').action('d', 'delCharAfter').mode('visual_mode').record(true);
    //delete line
    router.code('68_68', 'dd').action('dd', 'delCurrLine').record(true);
    //gg
    router.code(71, 'g').action('G', 'moveToLastLine');
    //G
    router.code('71_71', 'gg').action('gg', 'moveToFirstLine');
}
