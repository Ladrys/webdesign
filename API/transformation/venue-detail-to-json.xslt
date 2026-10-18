<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:param name="venueId" select="'h1'"/>
  <xsl:output method="text" encoding="UTF-8"/>
  <xsl:template match="/festival"><xsl:choose><xsl:when test="haly/hala[@id=$venueId]"><xsl:for-each select="haly/hala[@id=$venueId]">{"id":"<xsl:value-of select="@id"/>","name":"<xsl:value-of select="nazev"/>","location":"<xsl:value-of select="lokace"/>","capacity":<xsl:value-of select="velikost"/>,"description":"<xsl:value-of select="popis"/>"<xsl:call-template name="venue-ticketing"/>}</xsl:for-each></xsl:when><xsl:otherwise>{"id":"","name":"","location":"","capacity":0,"description":"Nenalezeno"}</xsl:otherwise></xsl:choose><xsl:if test="false()">,</xsl:if></xsl:template>

  <!-- Tentýž katalog scén používá JSON i offline web; ceny nejsou pevně zapsané v JavaScriptu. -->
  <xsl:template name="venue-ticketing">,"ticketing":{"standingCapacity":<xsl:value-of select="vstupenky_sceny/kapacita_stani"/>,"seats":{<xsl:for-each select="vstupenky_sceny/sedadla/sektor">"<xsl:value-of select="@kategorie"/>":{"rows":[<xsl:for-each select="rada">"<xsl:value-of select="."/>"<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],"perRow":<xsl:value-of select="@mist_v_rade"/>}<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>},"prices":{<xsl:for-each select="vstupenky_sceny/cenik/cena">"<xsl:value-of select="@kategorie"/>":{"day":<xsl:value-of select="@den"/>,"festival":<xsl:value-of select="@festival"/>}<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>}}</xsl:template>
</xsl:stylesheet>
