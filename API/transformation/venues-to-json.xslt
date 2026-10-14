<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="text" encoding="UTF-8"/>
  <xsl:template match="/festival">{"items":[<xsl:for-each select="haly/hala">{"id":"<xsl:value-of select="@id"/>","name":"<xsl:value-of select="nazev"/>","location":"<xsl:value-of select="lokace"/>","capacity":<xsl:value-of select="velikost"/>,"description":"<xsl:choose><xsl:when test="normalize-space(popis)!=''"><xsl:value-of select="popis"/></xsl:when><xsl:otherwise>Popis scény není uveden.</xsl:otherwise></xsl:choose>"}<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],"totalItems":<xsl:value-of select="count(haly/hala)"/>}</xsl:template>
</xsl:stylesheet>
