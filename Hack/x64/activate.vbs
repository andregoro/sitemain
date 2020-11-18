Dim licenseNumber
licenseNumber=""
If wscript.Arguments.Count=0 Then
  licenseNumber=InputBox("Enter your license number","Vbsedit Activation")
Else
  licenseNumber=WScript.Arguments(0)
End If

Dim toolkit
Set toolkit = CreateObject("vbsedit.toolkit")

Set objHTTP = Createobject("MSXML2.XMLHTTP")
objHTTP.open "POST", "http://www.vbsedit.com/key9/auto.asp", False
objHTTP.setRequestHeader "Content-type","application/x-www-form-urlencoded"
objHTTP.send "license=" & licenseNumber & "&id=" & toolkit.ProductID

Set objShell = CreateObject("Shell.Application")
Set objFolder = objShell.Namespace(&H1c)
Set objFolderItem = objFolder.Self

Dim fso
Set fso = WScript.CreateObject("Scripting.Filesystemobject")

Dim path
index=1
Do While True
  path = objFolderItem.Path & "\adersoft\vbsedit\vbsedit_" & index & ".lic"
  If Not(fso.FileExists(path)) Then
    Exit do
  End If
  index=index+1
Loop

Set objStream = CreateObject("ADODB.Stream")
objStream.Open
objStream.Type = 1
objStream.Write objHTTP.responseBody
objStream.SaveToFile path,2  
objStream.Close

size = fso.GetFile(path).Size
If size<>37672 Then
  WScript.Echo "Sorry. Something went wrong."
  WScript.Quit(100)
End If

WScript.Quit(200)

