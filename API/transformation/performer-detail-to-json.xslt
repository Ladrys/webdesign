<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:param name="performerId" select="'i1'"/>
  <xsl:output method="text" encoding="UTF-8"/>
  <xsl:template match="/festival"><xsl:choose><xsl:when test="interpreti/interpret[@id=$performerId]"><xsl:for-each select="interpreti/interpret[@id=$performerId]">{"id":"<xsl:value-of select="@id"/>","name":"<xsl:value-of select="nazev"/>","performerType":"<xsl:value-of select="typ_interpreta"/>","genre":"<xsl:value-of select="zanr"/>","description":"<xsl:value-of select="popis"/>"}</xsl:for-each></xsl:when><xsl:otherwise>{"id":"","name":"","performerType":"","genre":"","description":"Nenalezeno"}</xsl:otherwise></xsl:choose><xsl:if test="false()">,</xsl:if></xsl:template>
</xsl:stylesheet>
