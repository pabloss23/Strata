' Lanza el servidor de Strata en una ventana OCULTA (sin consola visible).
' Lo usa el arranque automatico de Windows (clave Run de usuario).
Set fso = CreateObject("Scripting.FileSystemObject")
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
Set sh = CreateObject("WScript.Shell")
' 0 = ventana oculta ; False = no esperar
sh.Run "cmd /c """ & scriptDir & "\serve.cmd""", 0, False
