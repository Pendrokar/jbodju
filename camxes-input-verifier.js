/*
 * Copyright (c) 2014, Andrew Browne <dersaidin@dersaidin.net>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
 * This extension includes camxes.js parser from:
 *     https://github.com/Ilmen-vodhr/ilmentufa
 */
function resetLojbanInputVerifierKeyup(e)
{
    // empty
    if (this.value === '')
    {
        $(this)
            .attr('title', '')
            .css('background-color', 'inherit')
        ;
        return;
    }

    var newValue = $(this).val();
    var oldValue = $(this).data('prevval');
    if (
        // a non-literal change
        oldValue === $(this).val()

        // a whitespace change makes no syntax difference in Lojban
        || (
            oldValue
            && oldValue.replace(/ /g, '') === newValue.replace(/ /g, '')
        )
    )
    {
        return;
    }

    // Save new value as old
    $(this).data('prevval', $(this).val());

    var pressedKey = e.key.toLowerCase();
    switch(pressedKey)
    {
        // a repeated vowel makes no syntax difference in Lojban
        case 'a':
        case 'b':
        case 'c':
        case 'd':
        case 'e':
            if ($(this).val().replace(' ', '').substr(-2, 2) === pressedKey + pressedKey)
            {
                return;
            }
            break;
    }

    var response =
    {
        gramatical: false,
        parse: [],
        error: {},
    };

    try
    {
        console.log('parsing');
        camxes.parse(newValue);
        response.gramatical = true;
    }
    catch(se)
    {
        /* SyntaxError */
        response.error = se;
    }

    if (response.gramatical)
    {
        $(this)
            .attr('title', 'Grammatical for camxes')
            .css('background-color', 'rgba(0,100,0,0.2)')
        ;
    }
    else
    {
        $(this)
            .attr('title', 'Ungrammatical for camxes due to ' + response.error)
            .css('background-color', 'rgba(100,0,0,0.2)')
        ;
    }
}

function resetLojbanInputVerifierTimeout()
{
    setTimeout(function(){
        // check if we are still within Lojban Discord channel
        if (location.href.substr(0, location.href.lastIndexOf('/')) === 'https://discordapp.com/channels/230498134843850762')
        {
            // try to attach / re-attach* keyup binding; * in case of channel switch
            $('.chat form textarea').on('keyup', resetLojbanInputVerifierKeyup);
        }
        resetLojbanInputVerifierTimeout();
    }, 1000);
}
resetLojbanInputVerifierTimeout();
