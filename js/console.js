
      propStartingWith = function (obj, prefix) {
        var res = [];
        for(var m in obj) {
          if(m.indexOf(prefix) === 0) {
            res.push(m);
          }
        }
        return res;
      };

      $(function() {

        // console.log override
        console = {
          log: function(item){
            jqconsole.Append($('<div style="color: #c4cccc;">'+item+'</div>'));
          }
        }
        // Creating the console.
        var header = 'Native Browser JavaScript\n';
        window.jqconsole = $('#console').jqconsole(header, '   ');

        // Abort prompt on Ctrl+Z.
        jqconsole.RegisterShortcut('Z', function() {
          jqconsole.AbortPrompt();
          handler();
        });
        // Move to line start Ctrl+A.
        jqconsole.RegisterShortcut('A', function() {
          jqconsole.MoveToStart();
          handler();
        });
        // Move to line end Ctrl+E.
        jqconsole.RegisterShortcut('E', function() {
          jqconsole.MoveToEnd();
          handler();
        });
        jqconsole.RegisterMatching('{', '}', 'brace');
        jqconsole.RegisterMatching('(', ')', 'paran');
        jqconsole.RegisterMatching('[', ']', 'bracket');
        // Handle a command.
        var handler = function(command) {
          if (command) {
            try {
              jqconsole.Write('=> ' + window.eval(command) + '\n', 'result');
            } catch (e) {
              jqconsole.Write('ReferenceError: ' + e.message + '\n', 'error');
            }
          }
          
          jqconsole.Prompt(true, handler, function(command) {
            // Continue line if can't compile the command.
            try {
              Function(command);
            } catch (e) {
              if (/[\[\{\(]$/.test(command)) {
                return 1;
              } else {
                return 0;
              }
            }
            return false;
          });
        };

        jqconsole.SetKeyPressHandler(function(e) {
          var text = jqconsole.GetPromptText() + String.fromCharCode(e.which);
          // We'll only suggest things on the window object.
          if (text.match(/\./)) {
            return;
          }

          var props = propStartingWith(window, text);
          if (props.length) {
            if (!$('.suggest').length) {
              $('<div/>').addClass('suggest').appendTo($('.jqconsole'));
            }
            $('.suggest').empty().show();
            props.forEach(function(prop) {
              $('.suggest').append('<div>' + prop + '</div>');
            });
            var pos = $('.jqconsole-cursor').offset();
            pos.left += 20;
            $('.suggest').offset(pos);
          } else {
            $('.suggest').hide();
          }
        });

        jqconsole.SetControlKeyHandler(function(e) {
          $('.suggest').hide();
          if (e.which === 9 && $('.suggest div').length) {
            jqconsole.SetPromptText($('.suggest div').first().text());
            return false;
          }
        });

        $('#run').on('click', function () {
          jqconsole.Reset();
          jqconsole.ResetHistory();
          var command = editor.getValue();
          handler(command)

      })

      $('#clear').on('click', function () {
        jqconsole.Reset();
        jqconsole.ResetHistory();
        handler();

    })
        // Initiate the first prompt.
        handler();
      });