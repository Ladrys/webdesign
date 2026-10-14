<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:param name="venueId" select="'h1'"/>
  <xsl:output method="text" encoding="UTF-8"/>
  <xsl:template match="/festival"><xsl:choose><xsl:when test="haly/hala[@id=$venueId]"><xsl:for-each select="haly/hala[@id=$venueId]">{"id":"<xsl:value-of select="@id"/>","name":"<xsl:value-of select="nazev"/>","location":"<xsl:value-of select="lokace"/>","capacity":<xsl:value-of select="velikost"/>,"description":"<xsl:value-of select="popis"/>"}</xsl:for-each></xsl:when><xsl:otherwise>{"id":"","name":"","location":"","capacity":0,"description":"Nenalezeno"}</xsl:otherwise></xsl:choose><xsl:if test="false()">,</xsl:if></xsl:template>
</xsl:stylesheet>
