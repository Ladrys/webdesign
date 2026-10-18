<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="text" encoding="UTF-8"/>
  <xsl:template match="/festival">{
  "id":"<xsl:value-of select="@id"/>",
  "name":"<xsl:value-of select="nazev"/>",
  "description":"<xsl:choose><xsl:when test="normalize-space(popis_festivalu)!=''"><xsl:value-of select="popis_festivalu"/></xsl:when><xsl:otherwise>Popis festivalu není uveden.</xsl:otherwise></xsl:choose>",
  "taxRate":<xsl:value-of select="sazba_dph"/>,
  "location":{"street":"<xsl:value-of select="mistokonani/ulice"/>","city":"<xsl:value-of select="mistokonani/mesto"/>","postalCode":"<xsl:value-of select="mistokonani/psc"/>"},
  "dates":[<xsl:for-each select="dny/den">{"id":"<xsl:value-of select="@id"/>","name":"<xsl:value-of select="nazev"/>","theme":"<xsl:value-of select="tema_dne"/>","description":"<xsl:choose><xsl:when test="normalize-space(popis)!=''"><xsl:value-of select="popis"/></xsl:when><xsl:otherwise>Bez doplňujícího popisu.</xsl:otherwise></xsl:choose>","date":"<xsl:value-of select="datumstart"/>","startTime":"<xsl:value-of select="casstart"/>","endTime":"<xsl:value-of select="caskonec"/>"}<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],
  "tickets":[<xsl:for-each select="vstupenky/vstupenka">{"id":"<xsl:value-of select="@id"/>","name":"<xsl:value-of select="nazev"/>","price":<xsl:value-of select="cena"/>,"currency":"<xsl:value-of select="mena"/>","description":"<xsl:value-of select="popis"/>"}<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],
  "camping":{"personPrice":<xsl:value-of select="kempovani/cena_osoby"/>,"vatRate":<xsl:value-of select="kempovani/sazba_dph"/>,"dates":{"from":"<xsl:value-of select="kempovani/datum_od"/>","to":"<xsl:value-of select="kempovani/datum_do"/>"},"types":[<xsl:for-each select="kempovani/typy/typ">{"id":"<xsl:value-of select="@id"/>","name":"<xsl:value-of select="nazev"/>","price":<xsl:value-of select="cena"/>,"maxPeople":<xsl:value-of select="max_osob"/>,"capacity":<xsl:value-of select="kapacita"/>}<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>]},
  "links":[<xsl:for-each select="odkazy/odkaz">{"id":"<xsl:value-of select="@id"/>","name":"<xsl:value-of select="nazev"/>","url":"<xsl:value-of select="url"/>"}<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],
  "contact":{"email":"<xsl:value-of select="kontakt/email"/>","phone":"<xsl:value-of select="kontakt/telefon"/>"}
}</xsl:template>
</xsl:stylesheet>
