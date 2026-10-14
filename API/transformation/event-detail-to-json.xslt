<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:param name="eventId" select="'a1'"/>
  <xsl:output method="text" encoding="UTF-8"/>
  <xsl:key name="venueById" match="hala" use="@id"/>
  <xsl:key name="performerById" match="interpret" use="@id"/>
  <xsl:template match="/festival"><xsl:choose><xsl:when test="sumakce/akce[@id=$eventId]"><xsl:for-each select="sumakce/akce[@id=$eventId]">{"id":"<xsl:value-of select="@id"/>","name":"<xsl:value-of select="nazev"/>","theme":"<xsl:value-of select="tema_akce"/>","description":"<xsl:value-of select="popis_akce"/>","date":"<xsl:value-of select="datumstart"/>","startTime":"<xsl:value-of select="casstart"/>","endTime":"<xsl:value-of select="caskonec"/>","dayId":"<xsl:value-of select="den_ref"/>","venueId":"<xsl:value-of select="hala_ref"/>","venueName":"<xsl:value-of select="key('venueById', hala_ref)/nazev"/>","performerIds":[<xsl:for-each select="interpreti/interpret_ref">"<xsl:value-of select="."/>"<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],"performers":[<xsl:for-each select="interpreti/interpret_ref">"<xsl:value-of select="key('performerById', .)/nazev"/>"<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>]}</xsl:for-each></xsl:when><xsl:otherwise>{"id":"","name":"","theme":"","description":"Nenalezeno","date":"","startTime":"","endTime":"","dayId":"","venueId":"","venueName":"","performerIds":[],"performers":[]}</xsl:otherwise></xsl:choose></xsl:template>
</xsl:stylesheet>
