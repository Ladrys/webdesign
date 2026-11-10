$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
function Assert-Equal($first,$second,$label){if([string]$first -cne [string]$second){throw "Mismatch: $label"}}
$settings=[Xml.XmlReaderSettings]::new();$settings.ValidationType=[Xml.ValidationType]::Schema
[void]$settings.Schemas.Add($null,(Join-Path $root 'festival.xsd'))
$settings.add_ValidationEventHandler({param($sender,$e) throw $e.Message})
$reader=[Xml.XmlReader]::Create((Join-Path $root 'data.xml'),$settings);while($reader.Read()){};$reader.Dispose()
Assert-Equal (Get-FileHash (Join-Path $root 'data.xml')).Hash (Get-FileHash (Join-Path $root 'data/festival.xml')).Hash 'root XML copy'
Assert-Equal (Get-FileHash (Join-Path $root 'festival.xsd')).Hash (Get-FileHash (Join-Path $root 'data/festival.xsd')).Hash 'root XSD copy'
[xml]$xml=Get-Content (Join-Path $root 'data.xml') -Raw -Encoding UTF8
$festival=Get-Content (Join-Path $root 'data/json/festival.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$venues=Get-Content (Join-Path $root 'data/json/venues.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$artists=Get-Content (Join-Path $root 'data/json/performers.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$events=Get-Content (Join-Path $root 'data/json/events.json') -Raw -Encoding UTF8 | ConvertFrom-Json
foreach($spec in @(
 @{nodes=$xml.SelectNodes('/festival/interpreti/interpret');items=$artists;map=@{name='nazev';performerType='typ_interpreta';genre='zanr';description='popis'}},
 @{nodes=$xml.SelectNodes('/festival/haly/hala');items=$venues;map=@{name='nazev';location='lokace';capacity='velikost';description='popis'}},
 @{nodes=$xml.SelectNodes('/festival/sumakce/akce');items=$events;map=@{name='nazev';theme='tema_akce';description='popis_akce';date='datumstart';startTime='casstart';endTime='caskonec';dayId='den_ref';venueId='hala_ref'}}
)){
 Assert-Equal $spec.nodes.Count $spec.items.Count 'entity counts'
 foreach($node in $spec.nodes){$record=@($spec.items | Where-Object id -EQ $node.id);if($record.Count -ne 1){throw "Non-unique ID $($node.id)"};$record=$record[0]
  foreach($field in $spec.map.Keys){Assert-Equal $record.$field $node.SelectSingleNode($spec.map[$field]).InnerText ($node.id+':'+$field)}
  if($record.performerIds){Assert-Equal ($record.performerIds -join ',') (($node.SelectNodes('interpreti/interpret_ref') | ForEach-Object InnerText) -join ',') 'performer references'}
 }
}
Assert-Equal $festival.name $xml.festival.nazev 'festival name'
Assert-Equal $festival.taxRate $xml.festival.sazba_dph 'tax rate'
foreach($day in $festival.dates){$node=$xml.SelectSingleNode("/festival/dny/den[@id='$($day.id)']");Assert-Equal $day.date $node.datumstart 'festival date'}
foreach($ticket in $festival.tickets){$node=$xml.SelectSingleNode("/festival/vstupenky/vstupenka[@id='$($ticket.id)']");Assert-Equal $ticket.price $node.cena 'ticket price'}
foreach($entry in $events){if($entry.venueId -notin $venues.id -or $entry.dayId -notin $festival.dates.id){throw 'Broken event reference'};foreach($artistId in $entry.performerIds){if($artistId -notin $artists.id){throw 'Broken artist reference'}}}
if($festival.dates.Count -lt 3 -or $venues.Count -lt 2 -or $artists.Count -lt 60 -or $events.Count -lt 60){throw 'Insufficient data'}
$result=@{date=(Get-Date).ToString('o');xsdValid=$true;rootCopiesEqual=$true;counts=@{days=$festival.dates.Count;venues=$venues.Count;performers=$artists.Count;events=$events.Count};checked='Entity IDs, core text fields, date/time fields, programme references, festival dates, ticket prices, XSD and root copies'}
[IO.Directory]::CreateDirectory((Join-Path $root 'test-artifacts')) | Out-Null
$result | ConvertTo-Json -Depth 5 | Set-Content -Encoding UTF8 (Join-Path $root 'test-artifacts/data-validation.json')
Write-Output 'PASS XML/XSD, 3 days, 3 stages, 60 artists, 60 events, references and core JSON fields'
