/**
 * Created by top on 15-9-6.
 */

exports.ready = function(router){

    //---------------------------
    //system feature keys:
    //---------------------------

    router.code(35, 'End').action('End', 'moveToCurrentLineTail');
    router.code(36, 'Home').action('Home', 'moveToCurrentLineHead');
    router.code(37, 'Left').action('Left', 'selectPrevCharacter');
    router.code(38, 'Up').action('Up', 'selectPrevLine');
    router.code(39, 'Right').action('Right', 'selectNextCharacter');
    router.code(40, 'Down').action('Down', 'selectNextLine');
    router.code(45, 'Insert').action('Insert', 'insert');
    router.code(46, 'Delete').action('Delete', 'delCharAfter').record(true);

    //---------------------------
    //vim feature keys:
    //---------------------------

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
    //G
    router.code(71, 'g').action('G', 'moveToLastLine');
    //gg
    router.code('71_71', 'gg').action('gg', 'moveToFirstLine');
    //move to next word
    router.code(87, 'w').action('w', 'moveToNextWord').action('W', 'moveToNextWord');
    //copy word
    router.code('89_87', 'yw').action('yw', 'copyWord');
    //delete one word
    router.code('68_87', 'dw').action('dw', 'deleteWord').record(true);
}
