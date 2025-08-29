import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { INotificacao } from "@/interfaces/INotificacao";

export const gerarRelatorioPDF = async (notificacoes: INotificacao[], cidade?: string) => {
    const esc = (v: any) =>
      String(v ?? "-")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
  
    const dataAgora = new Date();
    const dataFmt = dataAgora.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const horaFmt = dataAgora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const numeroRelatorio = `${dataAgora.getFullYear()}${String(
      dataAgora.getMonth() + 1
    ).padStart(2, "0")}${String(dataAgora.getDate()).padStart(2, "0")}-${String(
      dataAgora.getHours()
    ).padStart(2, "0")}${String(dataAgora.getMinutes()).padStart(2, "0")}`;
  
    const brasaoURL =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bras%C3%A3o_da_Rep%C3%BAblica_Federativa_do_Brasil.svg/512px-Bras%C3%A3o_da_Rep%C3%BAblica_Federativa_do_Brasil.svg.png";
  
    const linhas = notificacoes
      .map((not) => {
        const loc = not?.localizacao || {};
        return `
          <tr>
            <td>${esc(not.id)}</td>
            <td>${esc(not.userId)}</td>
            <td>${esc(not.descricao)}</td>
            <td>${esc(not.status)}</td>
            <td>${esc(not.dataEnvio)}</td>
            <td>${esc(loc.cidade)}</td>
            <td>${esc(loc.bairro)}</td>
            <td>${esc(loc.rua || loc.rua)}</td>
            <td>${esc(not.respostaPrefeitura)}</td>
          </tr>
        `;
      })
      .join("");
  
    const html = `
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          @page { size: A4; margin: 20mm 15mm 20mm 15mm; }
          * { box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; color: #222; }
          .faixas { height: 8px; margin-bottom: 12px; }
          .faixa-verde { background: #0a8f3f; height: 8px; }
          .faixa-amarela { background: #ffcc00; height: 8px; }
  
          .header {
            display: flex; align-items: center; gap: 16px; margin-bottom: 8px;
          }
          .header img { width: 56px; height: 56px; object-fit: contain; }
          .header-texto { flex: 1; }
          .org { font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
          .titulo { font-size: 18px; font-weight: bold; margin-top: 2px; }
          .subtitulo { font-size: 13px; color: #555; }
  
          .metadados {
            display: grid; grid-template-columns: 1fr 1fr;
            font-size: 12px; border: 1px solid #ccc; padding: 8px 10px; border-radius: 6px;
            margin: 10px 0 14px 0; gap: 4px 12px;
          }
          .meta b { display: inline-block; min-width: 120px; }
  
          .texto-oficial {
            font-size: 12.5px; text-align: justify; line-height: 1.45; margin-bottom: 10px;
          }
  
          table { width: 100%; border-collapse: collapse; margin-top: 8px; table-layout: fixed; }
          thead th {
            background: #f3f3f3; border: 1px solid #bbb; padding: 6px 6px; font-size: 11px;
          }
          tbody td {
            border: 1px solid #d0d0d0; padding: 6px 6px; font-size: 11px; vertical-align: top;
            word-wrap: break-word; overflow-wrap: anywhere;
          }
          tbody tr:nth-child(odd) { background: #fcfcfc; }
  
          .assinaturas {
            display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 28px;
          }
          .ass { text-align: center; margin-top: 36px; }
          .linha { border-top: 1px solid #333; width: 100%; margin: 0 auto 6px; height: 0; }
          .cargo { font-size: 12px; color: #444; }
  
          .rodape {
            position: fixed; bottom: -10mm; left: 0; right: 0;
            font-size: 10px; color: #666; display: flex; justify-content: space-between; padding: 0 15mm;
          }
          .pagina:after { content: counter(page) " / " counter(pages); }
  
          .secao-titulo {
            margin-top: 10px; font-weight: bold; font-size: 13px; letter-spacing: .2px;
          }
        </style>
      </head>
      <body>
        <div class="faixas">
          <div class="faixa-verde"></div>
          <div class="faixa-amarela"></div>
        </div>
  
        <div class="header">
          <img src="${brasaoURL}" />
          <div class="header-texto">
            <div class="org">Prefeitura Municipal</div>
            <div class="titulo">Relatório Oficial de Notificações</div>
            <div class="subtitulo">Secretaria Municipal de Serviços Urbanos</div>
          </div>
        </div>
  
        <div class="metadados">
          <div class="meta"><b>Nº do Relatório:</b> ${esc(numeroRelatorio)}</div>
          <div class="meta"><b>Data/Hora:</b> ${esc(dataFmt)} ${esc(horaFmt)}</div>
          <div class="meta"><b>Cidade:</b> ${esc(cidade || "Todas")}</div>
          <div class="meta"><b>Total de Notificações:</b> ${esc(notificacoes.length)}</div>
        </div>
  
        <div class="texto-oficial">
          O presente documento, emitido no âmbito desta Municipalidade, consolida as notificações registradas
          na plataforma administrativa, com vistas ao acompanhamento, análise e providências cabíveis pelos
          setores competentes. As informações aqui apresentadas contemplam dados de identificação, descrição
          do fato, localização, classificação, prioridade e status de tratativa.
        </div>
  
        <div class="secao-titulo">Relação de Notificações</div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Data</th>
              <th>Cidade</th>
              <th>Bairro</th>              
              <th>Rua</th>
              <th>Resposta</th>
            </tr>
          </thead>
          <tbody>
            ${linhas || `<tr><td colspan="15" style="text-align:center;">Nenhuma notificação registrada.</td></tr>`}
          </tbody>
        </table>
  
        <div class="assinaturas">
          <div class="ass">
            <div class="linha"></div>
            <div>Responsável pelo Setor</div>
            <div class="cargo">Matrícula / Carimbo</div>
          </div>
          <div class="ass">
            <div class="linha"></div>
            <div>Secretário(a) Municipal</div>
            <div class="cargo">Secretaria Competente</div>
          </div>
        </div>
  
        <div class="rodape">
          <div>Documento gerado eletronicamente — validade sujeita à conferência administrativa.</div>
          <div class="pagina">Página </div>
        </div>
      </body>
    </html>
    `;
  
    try {
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
  
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Compartilhar Relatório PDF",
        });
      } else {
        alert("PDF gerado em: " + uri);
      }
    } catch (e) {
      console.error("Erro ao gerar PDF:", e);
    }
  };