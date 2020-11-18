If WScript.Arguments.Count<>1 Then
  WScript.Quit
End If

folder = Left( WScript.Arguments(0),InStrRev(WScript.Arguments(0),"\"))
extension = Mid( WScript.Arguments(0),InStrRev(WScript.Arguments(0),"."))
extension=LCase(extension)

Dim fso
Set fso = CreateObject("Scripting.Filesystemobject")

allcharts=""
For Each file In fso.GetFolder(folder).Files
  If StrComp(Right(file.Name,Len(extension)),extension,vbTextCompare)=0 Then
    contents=ReadFile(file.Path)
    posallcharts1=InStr(contents,"];//_ALL_CHARTS_AUTOMATIC_")
    If posallcharts1>0 Then
      postitle1=InStr(contents,"<title>")
      postitle2=InStr(postitle1,contents,"</title>")
      If postitle1>0 And postitle2>0 Then
        title=Mid(contents,postitle1+7,postitle2-postitle1-7)
        If allcharts<>"" Then
          allcharts = allcharts & ","
        End If
        allcharts = allcharts & "{title:""" & JavascriptEscape(title) & """,filename:""" & JavascriptEscape(file.Name) & """}"      
      End If
    End If
  End If
Next

WScript.Echo allcharts

For Each file In fso.GetFolder(folder).Files
  If StrComp(Right(file.Name,Len(extension)),extension,vbTextCompare)=0 Then
    contents=ReadFile(file.Path)
    posallcharts1=InStr(contents,"var _allchartsautomatic_=[")
    posallcharts2=InStr(contents,"];//_ALL_CHARTS_AUTOMATIC_")
    If posallcharts1>0 And posallcharts2>0 Then
      myallcharts=Mid(contents,posallcharts1+26,posallcharts2-posallcharts1-26)
      If myallcharts<>allcharts Then
        newcontents=Left(contents,posallcharts1+25) & allcharts & Mid(contents,posallcharts2)
        SaveFile file.Path,newcontents
      End If
    End If
  End If
Next


Sub SaveFile(path,mynewcontents)
 Dim adodbstream
 Set adodbstream=CreateObject("ADODB.Stream")
 adodbstream.Open
 adodbstream.Charset = "utf-8"
 adodbstream.Type = 2
 adodbstream.WriteText mynewcontents
 adodbstream.SaveToFile path,2
 adodbstream.Close
End Sub

Function ReadFile(path)
 Dim adodbstream
 Set adodbstream=CreateObject("ADODB.Stream")
 adodbstream.Open
 adodbstream.Charset = "utf-8"
 adodbstream.Type = 2
 adodbstream.LoadFromFile(path)
 contents=adodbstream.ReadText(-1)
 adodbstream.Close
 ReadFile=contents
End Function

Function JavascriptEscape(s)
  Dim esc
  esc = Replace(s,"\","\\")
  esc = Replace(esc,"""","\""")
  esc = Replace(esc,"'","\'")
  JavascriptEscape = esc
End Function
  