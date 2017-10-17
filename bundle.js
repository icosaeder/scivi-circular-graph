var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SciViGraph;
(function (SciViGraph) {
    var Edge = (function () {
        function Edge(source, target, weight) {
            this.source = source;
            this.target = target;
            this.weight = weight;
            this.m_fromColor = 0;
            this.m_toColor = 0;
            this.m_alpha = 0;
            this.m_batch = undefined;
            this.m_highlight = undefined;
            this.m_visible = true;
            this.source.addEdge(this);
        }
        Edge.prototype.rgb2hsv = function (rgb) {
            var result = [0, 0, 0];
            var r = rgb >> 16 & 0xFF;
            var g = rgb >> 8 & 0xFF;
            var b = rgb & 0xFF;
            r /= 255;
            g /= 255;
            b /= 255;
            var mm = Math.max(r, g, b);
            var m = Math.min(r, g, b);
            var c = mm - m;
            if (c == 0)
                result[0] = 0;
            else if (mm == r)
                result[0] = ((g - b) / c) % 6;
            else if (mm == g)
                result[0] = (b - r) / c + 2;
            else
                result[0] = (r - g) / c + 4;
            result[0] *= 60;
            if (result[0] < 0)
                result[0] += 360;
            result[2] = mm;
            if (result[2] == 0)
                result[1] = 0;
            else
                result[1] = c / result[2];
            result[1] *= 100;
            result[2] *= 100;
            return result;
        };
        Edge.prototype.hsv2rgb = function (hsv) {
            if (hsv[0] < 0)
                hsv[0] = 0;
            if (hsv[1] < 0)
                hsv[1] = 0;
            if (hsv[2] < 0)
                hsv[2] = 0;
            if (hsv[0] >= 360)
                hsv[0] = 359;
            if (hsv[1] > 100)
                hsv[1] = 100;
            if (hsv[2] > 100)
                hsv[2] = 100;
            hsv[0] /= 60;
            hsv[1] /= 100;
            hsv[2] /= 100;
            var c = hsv[1] * hsv[2];
            var x = c * (1 - Math.abs(hsv[0] % 2 - 1));
            var r = 0;
            var g = 0;
            var b = 0;
            if (hsv[0] >= 0 && hsv[0] < 1) {
                r = c;
                g = x;
            }
            else if (hsv[0] >= 1 && hsv[0] < 2) {
                r = x;
                g = c;
            }
            else if (hsv[0] >= 2 && hsv[0] < 3) {
                g = c;
                b = x;
            }
            else if (hsv[0] >= 3 && hsv[0] < 4) {
                g = x;
                b = c;
            }
            else if (hsv[0] >= 4 && hsv[0] < 5) {
                r = x;
                b = c;
            }
            else {
                r = c;
                b = x;
            }
            var m = hsv[2] - c;
            r = Math.round((r + m) * 255);
            g = Math.round((g + m) * 255);
            b = Math.round((b + m) * 255);
            return (r << 16) | (g << 8) | b;
        };
        Edge.prototype.passiveColor = function (rgb) {
            var hsv = this.rgb2hsv(rgb);
            hsv[1] = 10;
            hsv[2] = 90;
            return this.hsv2rgb(hsv);
        };
        Edge.prototype.setBatch = function (batch) {
            this.m_batch = batch;
        };
        Object.defineProperty(Edge.prototype, "highlight", {
            get: function () {
                return this.m_highlight;
            },
            set: function (hl) {
                if (hl != this.m_highlight) {
                    this.m_highlight = hl;
                    var fromColor = this.source.groupColor;
                    var toColor = this.target.groupColor;
                    switch (this.m_highlight) {
                        case SciViGraph.HighlightType.None: {
                            this.m_fromColor = this.passiveColor(fromColor);
                            this.m_toColor = this.passiveColor(toColor);
                            this.m_alpha = Edge.m_passiveEdgeAlpha;
                            this.m_batch.sendToBack();
                            break;
                        }
                        case SciViGraph.HighlightType.Hover: {
                            this.m_fromColor = fromColor;
                            this.m_toColor = toColor;
                            this.m_alpha = Edge.m_hoveredEdgeAlpha;
                            this.m_batch.sendToFront();
                            break;
                        }
                        case SciViGraph.HighlightType.Selection: {
                            this.m_fromColor = fromColor;
                            this.m_toColor = toColor;
                            this.m_alpha = Edge.m_selectedEdgeAlpha;
                            this.m_batch.sendToFront();
                            break;
                        }
                    }
                    this.m_batch.setNeedsUpdate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Edge.prototype, "visible", {
            get: function () {
                return this.m_visible;
            },
            set: function (v) {
                if (v != this.m_visible) {
                    this.m_visible = v;
                    this.m_batch.setNeedsUpdate();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Edge.prototype, "fromColor", {
            get: function () {
                return this.m_fromColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Edge.prototype, "toColor", {
            get: function () {
                return this.m_toColor;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Edge.prototype, "alpha", {
            get: function () {
                return this.m_alpha;
            },
            enumerable: true,
            configurable: true
        });
        Edge.prototype.invalidate = function () {
            this.m_highlight = undefined;
        };
        Edge.m_passiveEdgeAlpha = 0.1;
        Edge.m_hoveredEdgeAlpha = 1.0;
        Edge.m_selectedEdgeAlpha = 1.0;
        Edge.minThickness = 1.5;
        Edge.maxThickness = 10.0;
        return Edge;
    }());
    SciViGraph.Edge = Edge;
})(SciViGraph || (SciViGraph = {}));
var SciViGraph;
(function (SciViGraph) {
    var EdgeBatch = (function (_super) {
        __extends(EdgeBatch, _super);
        function EdgeBatch() {
            var _this = _super.call(this) || this;
            _this.m_edges = [];
            _this.m_needsUpdate = false;
            _this.m_move = 0;
            return _this;
        }
        EdgeBatch.prototype.addVertex = function (vertices, px, py, nx, ny, wIn, wOut, r, g, b, a) {
            var dx = nx * wIn;
            var dy = ny * wIn;
            vertices.push(px - dx, py - dy, r, g, b, a);
            vertices.push(px + dx, py + dy, r, g, b, a);
            dx = nx * wOut;
            dy = ny * wOut;
            vertices.push(px - dx, py - dy, 0, 0, 0, 0);
            vertices.push(px + dx, py + dy, 0, 0, 0, 0);
        };
        EdgeBatch.prototype.buildLine = function (graphicsData, webGLData, fromColor, toColor, alpha) {
            graphicsData.points = graphicsData.shape.points.slice();
            var points = graphicsData.points;
            if (points.length === 0)
                return;
            var vertices = webGLData.points;
            var indices = webGLData.indices;
            var length = points.length / 2;
            var indexCount = points.length;
            var indexStart = vertices.length / 6;
            var feather = 1;
            var widthIn = graphicsData.lineWidth / 2;
            var widthOut = widthIn + feather;
            var p1x = 0;
            var p1y = 0;
            var p2x = 0;
            var p2y = 0;
            var p3x = 0;
            var p3y = 0;
            var totalLength = 0;
            for (var i = 0; i < length - 1; ++i) {
                p1x = points[i * 2] - points[(i + 1) * 2];
                p1y = points[i * 2 + 1] - points[(i + 1) * 2 + 1];
                totalLength += Math.sqrt(p1x * p1x + p1y * p1y);
            }
            var rFrom = (fromColor >> 16 & 0xFF) * alpha / 255;
            var gFrom = (fromColor >> 8 & 0xFF) * alpha / 255;
            var bFrom = (fromColor & 0xFF) * alpha / 255;
            var rTo = (toColor >> 16 & 0xFF) * alpha / 255;
            var gTo = (toColor >> 8 & 0xFF) * alpha / 255;
            var bTo = (toColor & 0xFF) * alpha / 255;
            var r = rFrom;
            var g = gFrom;
            var b = bFrom;
            var t = 0;
            var n1x = 0;
            var n1y = 0;
            var n2x = 0;
            var n2y = 0;
            var n3x = 0;
            var n3y = 0;
            var d = 0;
            var nLen = 0;
            var currentLength = 0;
            for (var i = 0; i < length; ++i) {
                if (i == 0) {
                    p1x = points[0];
                    p1y = points[1];
                    p2x = points[0];
                    p2y = points[1];
                    p3x = points[2];
                    p3y = points[3];
                    r = rFrom;
                    g = gFrom;
                    b = bFrom;
                }
                else if (i == length - 1) {
                    p1x = points[(i - 1) * 2];
                    p1y = points[(i - 1) * 2 + 1];
                    p2x = points[i * 2];
                    p2y = points[i * 2 + 1];
                    p3x = points[i * 2];
                    p3y = points[i * 2 + 1];
                    r = rTo;
                    g = gTo;
                    b = bTo;
                }
                else {
                    p1x = points[(i - 1) * 2];
                    p1y = points[(i - 1) * 2 + 1];
                    p2x = points[i * 2];
                    p2y = points[i * 2 + 1];
                    p3x = points[(i + 1) * 2];
                    p3y = points[(i + 1) * 2 + 1];
                    t = currentLength / totalLength;
                    r = rFrom + t * (rTo - rFrom);
                    g = gFrom + t * (gTo - gFrom);
                    b = bFrom + t * (bTo - bFrom);
                }
                n1x = -(p2y - p1y);
                n1y = p2x - p1x;
                n2x = -(p3y - p2y);
                n2y = p3x - p2x;
                nLen = Math.sqrt(n1x * n1x + n1y * n1y);
                if (nLen < 0.1) {
                    nLen = Math.sqrt(n2x * n2x + n2y * n2y);
                    if (nLen < 0.1) {
                        continue;
                    }
                    else {
                        n2x /= nLen;
                        n2y /= nLen;
                        n1x = n2x;
                        n1y = n2y;
                    }
                }
                else {
                    n1x /= nLen;
                    n1y /= nLen;
                    var l = Math.sqrt(n2x * n2x + n2y * n2y);
                    if (l < 0.1) {
                        n2x = n1x;
                        n2y = n1y;
                    }
                    else {
                        nLen = l;
                        n2x /= nLen;
                        n2y /= nLen;
                    }
                }
                currentLength += nLen;
                d = n1x * n2x + n1y * n2y;
                if (d < -0.5) {
                    n3x = n1x - n2x;
                    n3y = n1y - n2y;
                }
                else {
                    n3x = n1x + n2x;
                    n3y = n1y + n2y;
                }
                nLen = Math.sqrt(n3x * n3x + n3y * n3y);
                n3x /= nLen;
                n3y /= nLen;
                d = n1x * n3x + n1y * n3y;
                this.addVertex(vertices, p2x, p2y, n3x, n3y, widthIn / d, widthOut / d, r, g, b, alpha);
                if (i < length - 1) {
                    indices.push(indexStart + 2);
                    indices.push(indexStart + 6);
                    indices.push(indexStart + 0);
                    indices.push(indexStart + 0);
                    indices.push(indexStart + 6);
                    indices.push(indexStart + 4);
                    indices.push(indexStart + 0);
                    indices.push(indexStart + 4);
                    indices.push(indexStart + 1);
                    indices.push(indexStart + 1);
                    indices.push(indexStart + 4);
                    indices.push(indexStart + 5);
                    indices.push(indexStart + 1);
                    indices.push(indexStart + 5);
                    indices.push(indexStart + 3);
                    indices.push(indexStart + 3);
                    indices.push(indexStart + 5);
                    indices.push(indexStart + 7);
                    indexStart += 4;
                }
            }
        };
        EdgeBatch.prototype.updateGraphics = function (uid, gl, renderer) {
            var webGL = this._webGL[uid];
            var graphicsRenderer = renderer.plugins.graphics;
            if (!webGL)
                webGL = this._webGL[uid] = { lastIndex: 0, data: [], gl: gl, clearDirty: -1, dirty: -1 };
            webGL.dirty = this.dirty;
            if (this.clearDirty !== webGL.clearDirty) {
                webGL.clearDirty = this.clearDirty;
                webGL.data.forEach(function (webGLData) {
                    graphicsRenderer.graphicsDataPool.push(webGLData);
                });
                webGL.data.length = 0;
                webGL.lastIndex = 0;
            }
            var webGLData = void 0;
            for (var i = webGL.lastIndex; i < this.graphicsData.length; ++i) {
                this.buildLine(this.graphicsData[i], graphicsRenderer.getWebGLData(webGL, 0), this.m_colors[i].from, this.m_colors[i].to, this.m_colors[i].alpha);
                webGL.lastIndex++;
            }
            renderer.bindVao(null);
            webGL.data.forEach(function (webGLData) {
                if (webGLData.dirty)
                    webGLData.upload();
            });
        };
        EdgeBatch.prototype._renderWebGL = function (renderer) {
            var _this = this;
            renderer.setObjectRenderer(renderer.plugins.graphics);
            var gl = renderer.gl;
            var uid = renderer.plugins.graphics.CONTEXT_UID;
            var webGLData = void 0;
            var webGL = this._webGL[uid];
            if (!webGL || this.dirty !== webGL.dirty) {
                this.updateGraphics(uid, gl, renderer);
                webGL = this._webGL[uid];
            }
            var shader = renderer.plugins.graphics.primitiveShader;
            renderer.bindShader(shader);
            renderer.state.setBlendMode(this.blendMode);
            webGL.data.forEach(function (webGLData) {
                var shaderTemp = webGLData.shader;
                renderer.bindShader(shaderTemp);
                shaderTemp.uniforms.translationMatrix = _this.transform.worldTransform.toArray(true);
                shaderTemp.uniforms.tint = [1, 1, 1];
                shaderTemp.uniforms.alpha = _this.worldAlpha;
                renderer.bindVao(webGLData.vao);
                webGLData.vao.draw(gl.TRIANGLES, webGLData.indices.length);
            });
        };
        EdgeBatch.prototype.bringToFront = function () {
            var p = this.parent;
            if (p) {
                p.removeChild(this);
                p.addChild(this);
            }
        };
        EdgeBatch.prototype.bringToBack = function () {
            var p = this.parent;
            if (p) {
                p.removeChild(this);
                p.addChildAt(this, 0);
            }
        };
        EdgeBatch.prototype.update = function () {
            var _this = this;
            var p = this.parent;
            this.clear();
            this.m_colors = [];
            this.m_edges.forEach(function (edge) {
                if (edge.visible) {
                    _this.moveTo(edge.source.x, edge.source.y);
                    _this.lineStyle(SciViGraph.Edge.minThickness + (SciViGraph.Edge.maxThickness - SciViGraph.Edge.minThickness) * edge.weight / p.maxEdgeWeight, 0x0, 1);
                    _this.m_colors.push({ from: edge.fromColor, to: edge.toColor, alpha: edge.alpha });
                    _this.quadraticCurveTo(0, 0, edge.target.x, edge.target.y);
                }
            });
            if (this.m_move > 0)
                this.bringToFront();
            else if (this.m_move < 0)
                this.bringToBack();
            this.m_move = 0;
        };
        EdgeBatch.prototype.addEdge = function (edge) {
            this.m_edges.push(edge);
            edge.setBatch(this);
            this.m_needsUpdate = true;
        };
        EdgeBatch.prototype.setNeedsUpdate = function () {
            this.m_needsUpdate = true;
        };
        EdgeBatch.prototype.sendToFront = function () {
            this.m_move = 1;
        };
        EdgeBatch.prototype.sendToBack = function () {
            this.m_move = -1;
        };
        EdgeBatch.prototype.prepare = function () {
            if (this.m_needsUpdate) {
                this.update();
                this.m_needsUpdate = false;
                return true;
            }
            else {
                return false;
            }
        };
        Object.defineProperty(EdgeBatch.prototype, "isFull", {
            get: function () {
                return this.m_edges.length == 10;
            },
            enumerable: true,
            configurable: true
        });
        return EdgeBatch;
    }(PIXI.Graphics));
    SciViGraph.EdgeBatch = EdgeBatch;
})(SciViGraph || (SciViGraph = {}));
function start(container, data, colors) {
    var parser = new SciViGraph.Parser(data, colors);
    var renderer = new SciViGraph.Renderer(container, parser.nodes, parser.edges, parser.colors, parser.maxEdgeWeight, parser.maxNodeWeight);
}
var SciViGraph;
(function (SciViGraph) {
    var Node = (function (_super) {
        __extends(Node, _super);
        function Node(label, groupID, weight, nmb) {
            var _this = _super.call(this) || this;
            _this.label = label;
            _this.groupID = groupID;
            _this.weight = weight;
            _this.nmb = nmb;
            _this.m_column = new PIXI.Graphics();
            _this.m_column.beginFill(0xFFCB35, 1.0);
            _this.addChild(_this.m_column);
            _this.m_text = new PIXI.Text(label);
            _this.m_text.style = new PIXI.TextStyle({
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                fontSize: "24px"
            });
            _this.addChild(_this.m_text);
            _this.m_highlight = undefined;
            _this.m_needsUpdate = false;
            _this.m_highlightSet = false;
            _this.m_edges = [];
            _this.m_edgeBatches = [];
            return _this;
        }
        Object.defineProperty(Node.prototype, "highlight", {
            get: function () {
                return this.m_highlight;
            },
            set: function (hl) {
                if (hl != this.m_highlight) {
                    this.m_highlight = hl;
                    this.color = this.groupColor;
                    switch (this.m_highlight) {
                        case SciViGraph.HighlightType.None: {
                            this.m_text.style.fontWeight = "";
                            this.m_text.text = "  " + this.label + "  ";
                            this.alpha = Node.m_passiveTextAlpha;
                            break;
                        }
                        case SciViGraph.HighlightType.Hover: {
                            this.m_text.style.fontWeight = "";
                            this.m_text.text = "  " + this.label + "  ";
                            this.alpha = Node.m_hoveredTextAlpha;
                            break;
                        }
                        case SciViGraph.HighlightType.Selection: {
                            this.m_text.style.fontWeight = "bold";
                            this.m_text.text = " [ " + this.label + " ] ";
                            this.alpha = Node.m_selectedTextAlpha;
                            break;
                        }
                    }
                    this.m_needsUpdate = true;
                }
                this.m_highlightSet = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "highlightSet", {
            get: function () {
                return this.m_highlightSet;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "groupColor", {
            get: function () {
                return this.parent.colors[this.groupID];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "color", {
            set: function (newColor) {
                this.m_text.style.fill = SciViGraph.color2string(newColor);
            },
            enumerable: true,
            configurable: true
        });
        Node.prototype.addEdge = function (edge) {
            this.m_edges.push(edge);
            var batch;
            if (this.m_edgeBatches.length == 0 ||
                this.m_edgeBatches[this.m_edgeBatches.length - 1].isFull) {
                batch = new SciViGraph.EdgeBatch();
                this.m_edgeBatches.push(batch);
            }
            else {
                batch = this.m_edgeBatches[this.m_edgeBatches.length - 1];
            }
            batch.addEdge(edge);
        };
        Object.defineProperty(Node.prototype, "edges", {
            get: function () {
                return this.m_edges;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "edgeBatches", {
            get: function () {
                return this.m_edgeBatches;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Node.prototype, "svRenderer", {
            set: function (newSVRenderer) {
                this.m_svRenderer = newSVRenderer;
            },
            enumerable: true,
            configurable: true
        });
        Node.prototype.prepare = function () {
            if (!this.m_highlightSet)
                this.highlight = SciViGraph.HighlightType.None;
            var result = this.m_needsUpdate;
            this.m_highlightSet = false;
            this.m_needsUpdate = false;
            return result;
        };
        Node.prototype.invalidate = function () {
            this.m_highlight = undefined;
            this.m_edges.forEach(function (edge) {
                if (edge.visible)
                    edge.invalidate();
            });
        };
        Node.prototype.setAnchor = function (x, y) {
            var p = this.parent;
            var w = Node.m_columnMinHeight + (Node.m_columnMaxHeight - Node.m_columnMinHeight) * this.weight / p.maxNodeWeight;
            this.m_column.drawRect(-w * x, -Node.m_columnWidth * y, w, Node.m_columnWidth);
            this.m_text.anchor.set(x, y);
        };
        Node.prototype.setHighlightForEdgesAndTargetNodes = function (hl) {
            this.m_edges.forEach(function (edge) {
                if (edge.visible) {
                    edge.highlight = hl;
                    if (!edge.target.highlightSet)
                        edge.target.highlight = hl;
                }
            });
        };
        Node.prototype.setHighlightForEdges = function (hl) {
            this.m_edges.forEach(function (edge) {
                if (edge.visible)
                    edge.highlight = hl;
            });
        };
        Node.spacingNeeded = function () {
            return Node.m_columnWidth / 2;
        };
        Node.m_passiveTextAlpha = 0.3;
        Node.m_hoveredTextAlpha = 1.0;
        Node.m_selectedTextAlpha = 1.0;
        Node.m_columnWidth = 20.0;
        Node.m_columnMinHeight = 2.0;
        Node.m_columnMaxHeight = 100.0;
        return Node;
    }(PIXI.Sprite));
    SciViGraph.Node = Node;
})(SciViGraph || (SciViGraph = {}));
var SciViGraph;
(function (SciViGraph) {
    var IJsonFormat = (function () {
        function IJsonFormat() {
        }
        return IJsonFormat;
    }());
    SciViGraph.IJsonFormat = IJsonFormat;
    var Parser = (function () {
        function Parser(jsonData, colors) {
            this.m_nodes = [];
            this.m_edges = [];
            this.m_colors = [];
            this.m_maxEdgeWeight = 0;
            this.m_maxNodeWeight = 0;
            this.processNodes(jsonData.nodes);
            this.processEdges(jsonData.edges);
            this.processColors(colors);
        }
        Parser.prototype.processNodes = function (nodes) {
            var _this = this;
            nodes.forEach(function (node) {
                if (node.weight > _this.m_maxNodeWeight)
                    _this.m_maxNodeWeight = node.weight;
                _this.m_nodes[node.id] = new SciViGraph.Node(node.label, node.group, node.weight, node.nmb);
            });
        };
        Parser.prototype.processEdges = function (edges) {
            var _this = this;
            edges.forEach(function (edge) {
                if (edge.weight > _this.m_maxEdgeWeight)
                    _this.m_maxEdgeWeight = edge.weight;
                _this.m_edges.push(new SciViGraph.Edge(_this.m_nodes[edge.source], _this.m_nodes[edge.target], edge.weight));
            });
        };
        Parser.prototype.processColors = function (colors) {
            this.m_colors = colors;
        };
        Object.defineProperty(Parser.prototype, "nodes", {
            get: function () {
                var result = [];
                for (var key in this.m_nodes) {
                    result.push(this.m_nodes[key]);
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Parser.prototype, "edges", {
            get: function () {
                return this.m_edges;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Parser.prototype, "colors", {
            get: function () {
                return this.m_colors;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Parser.prototype, "maxEdgeWeight", {
            get: function () {
                return this.m_maxEdgeWeight;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(Parser.prototype, "maxNodeWeight", {
            get: function () {
                return this.m_maxNodeWeight;
            },
            enumerable: true,
            configurable: true
        });
        ;
        return Parser;
    }());
    SciViGraph.Parser = Parser;
})(SciViGraph || (SciViGraph = {}));
var SciViGraph;
(function (SciViGraph) {
    var HighlightType;
    (function (HighlightType) {
        HighlightType[HighlightType["None"] = 0] = "None";
        HighlightType[HighlightType["Hover"] = 1] = "Hover";
        HighlightType[HighlightType["Selection"] = 2] = "Selection";
    })(HighlightType = SciViGraph.HighlightType || (SciViGraph.HighlightType = {}));
    function color2string(c) {
        return "#" +
            (c >> 20 & 0xF).toString(16) +
            (c >> 16 & 0xF).toString(16) +
            (c >> 12 & 0xF).toString(16) +
            (c >> 8 & 0xF).toString(16) +
            (c >> 4 & 0xF).toString(16) +
            (c & 0xF).toString(16);
    }
    SciViGraph.color2string = color2string;
    function string2color(s) {
        if (s.length !== 7)
            return 0;
        var result = 0;
        s = s.toLowerCase();
        var zCode = "0".charCodeAt(0);
        var nCode = zCode + 9;
        var aCode = "a".charCodeAt(0);
        var fCode = aCode + 5;
        for (var i = 1; i < s.length; ++i) {
            var c = s.charCodeAt(i);
            if (c >= zCode && c <= nCode)
                c -= zCode;
            else if (c >= aCode && c <= fCode)
                c -= aCode - 10;
            else
                return 0;
            result |= c << (4 * (s.length - i - 1));
        }
        return result;
    }
    SciViGraph.string2color = string2color;
    var Renderer = (function () {
        function Renderer(m_container, m_nodes, m_edges, colors, maxEdgeWeight, maxNodeWeight) {
            this.m_container = m_container;
            this.m_nodes = m_nodes;
            this.m_edges = m_edges;
            this.m_nodeWeight = { min: 0, max: maxNodeWeight };
            this.m_edgeWeight = { min: 0, max: maxEdgeWeight };
            this.initInterface();
            this.layout();
            var settings = {
                transparent: false,
                antialias: false,
                resolution: window.devicePixelRatio,
                autoResize: true,
                roundPixels: false,
            };
            this.m_stage = new SciViGraph.Scene(colors, maxEdgeWeight, maxNodeWeight);
            this.m_stage.position.set(this.m_container.clientWidth / 2.0, this.m_container.clientHeight / 2.0);
            this.m_renderer = PIXI.autoDetectRenderer(this.m_container.clientWidth, this.m_container.clientHeight, settings);
            this.m_container.appendChild(this.m_renderer.view);
            this.m_renderer['plugins']['interaction']['moveWhenInside'] = true;
            this.m_renderer.backgroundColor = 0xFFFFFF;
            this.m_hoveredNode = null;
            this.m_selectedNode = null;
            this.m_clickCaught = false;
            this.m_clicked = false;
            this.m_mousePressed = false;
            this.m_panning = false;
            this.m_panPrevX = 0;
            this.m_panPrevY = 0;
            this.createNodes();
            this.createEdges();
            this.render(true);
        }
        Renderer.prototype.getNodeByPosition = function (x, y) {
            x -= this.m_stage.position.x;
            y -= this.m_stage.position.y;
            var d = x * x + y * y;
            var r = this.m_radius;
            var s = this.m_stage.scale.x * this.m_stage.scale.x;
            var inRing = r * r * s;
            r += Renderer.m_maxTextLength;
            var outRing = r * r * s;
            if (d > inRing && d < outRing) {
                var a = Math.atan2(y, x);
                if (a < 0.0)
                    a += 2.0 * Math.PI;
                var index = Math.round(a * this.m_nodes.length / (2.0 * Math.PI));
                if (index < 0 || index >= this.m_nodes.length)
                    index = 0;
                return this.m_nodes[index];
            }
            return null;
        };
        Renderer.prototype.clearSelected = function () {
            this.m_selectedNode = null;
        };
        Renderer.prototype.initInterface = function () {
            var _this = this;
            window.addEventListener("resize", function () { _this.reshape(); });
            var onWheel = function (e) {
                e = e || window.event;
                var delta = e.deltaY || e.detail || e.wheelDelta;
                if (delta != undefined) {
                    var d = 1.05;
                    var s = _this.m_stage.scale.x * (delta < 0 ? 1 / d : d);
                    if (s < 0.1)
                        s = 0.1;
                    else if (s > 1.0)
                        s = 1.0;
                    _this.m_stage.scale.set(s, s);
                    _this.m_renderer.render(_this.m_stage);
                }
            };
            var onMouseMove = function (e) {
                e = e || window.event;
                if (_this.m_mousePressed) {
                    var dx = e.clientX - _this.m_panPrevX;
                    var dy = e.clientY - _this.m_panPrevY;
                    var r = _this.m_radius / 2.0;
                    _this.m_panPrevX = e.clientX;
                    _this.m_panPrevY = e.clientY;
                    _this.m_stage.position.set(_this.m_stage.position.x + dx, _this.m_stage.position.y + dy);
                    if (_this.m_stage.position.x < -r)
                        _this.m_stage.position.x = -r;
                    else if (_this.m_stage.position.x > _this.m_container.clientWidth + r)
                        _this.m_stage.position.x = _this.m_container.clientWidth + r;
                    if (_this.m_stage.position.y < -r)
                        _this.m_stage.position.y = -r;
                    else if (_this.m_stage.position.y > _this.m_container.clientHeight + r)
                        _this.m_stage.position.y = _this.m_container.clientHeight + r;
                    _this.render(true);
                    _this.m_panning = true;
                }
                else {
                    _this.m_hoveredNode = _this.getNodeByPosition(e.clientX, e.clientY);
                    _this.render(false);
                }
            };
            var onMouseOut = function () {
                _this.m_hoveredNode = null;
                _this.m_mousePressed = false;
                _this.m_panning = false;
                _this.render(false);
            };
            var onMouseDown = function (e) {
                e = e || window.event;
                _this.m_mousePressed = true;
                _this.m_panPrevX = e.clientX;
                _this.m_panPrevY = e.clientY;
            };
            var onMouseUp = function (e) {
                _this.m_mousePressed = false;
                if (!_this.m_panning) {
                    e = e || window.event;
                    _this.m_clickCaught = true;
                    var node = _this.getNodeByPosition(e.clientX, e.clientY);
                    if (node == null || node == _this.m_selectedNode)
                        _this.clearSelected();
                    else {
                        _this.m_selectedNode = node;
                    }
                    _this.render(false);
                }
                _this.m_panning = false;
            };
            this.m_container.onmousemove = onMouseMove;
            this.m_container.onmouseout = onMouseOut;
            this.m_container.onmousedown = onMouseDown;
            this.m_container.onmouseup = onMouseUp;
            this.m_container.onwheel = onWheel;
        };
        Renderer.prototype.layout = function () {
            var w = window.innerWidth;
            var h = window.innerHeight;
            this.m_container.style.width = w.toString() + "px";
            this.m_container.style.height = h.toString() + "px";
        };
        Renderer.prototype.createNodes = function () {
            var _this = this;
            var angleStep = 2.0 * Math.PI / this.m_nodes.length;
            var radius = Math.min(this.m_container.clientWidth, this.m_container.clientHeight) / 2.0;
            this.m_radius = (this.m_nodes.length * SciViGraph.Node.spacingNeeded()) / (2.0 * Math.PI);
            var s = radius / (this.m_radius + Renderer.m_maxTextLength);
            this.m_stage.scale.set(s, s);
            this.m_nodes.sort(function (x1, x2) { return ~~(x1.nmb > x2.nmb); });
            console.log("Number of nodes: " + this.m_nodes.length);
            this.m_nodes.forEach(function (node, i) {
                if (node.visible) {
                    var x = _this.m_radius * Math.cos(i * angleStep);
                    var y = _this.m_radius * Math.sin(i * angleStep);
                    _this.m_stage.addChild(node);
                    node.position.set(x, y);
                    node.rotation = Math.atan2(-x, y) + Math.PI / 2;
                    if (node.rotation > Math.PI / 2) {
                        node.scale.set(-0.5, -0.5);
                        node.setAnchor(1.0, 0.5);
                    }
                    else {
                        node.scale.set(0.5, 0.5);
                        node.setAnchor(0.0, 0.5);
                    }
                    node.highlight = HighlightType.None;
                    node.svRenderer = _this;
                }
            });
        };
        Renderer.prototype.createEdges = function () {
            var _this = this;
            console.log("Number of edges: " + this.m_edges.length);
            this.m_edgeBatches = [];
            this.m_nodes.forEach(function (node) {
                node.edgeBatches.forEach(function (batch) {
                    _this.m_stage.addChild(batch);
                    _this.m_edgeBatches.push(batch);
                });
            });
            this.m_edges.forEach(function (edge) {
                edge.highlight = HighlightType.None;
            });
        };
        Renderer.prototype.render = function (force) {
            var _this = this;
            var needsRender = force;
            if (this.m_clicked && !this.m_clickCaught)
                this.clearSelected();
            this.m_clicked = false;
            this.m_clickCaught = false;
            if (this.m_selectedNode != null) {
                this.m_selectedNode.highlight = HighlightType.Selection;
                this.m_selectedNode.setHighlightForEdgesAndTargetNodes(HighlightType.Hover);
            }
            if (this.m_hoveredNode != null && this.m_selectedNode != this.m_hoveredNode) {
                this.m_hoveredNode.highlight = HighlightType.Hover;
                this.m_hoveredNode.setHighlightForEdgesAndTargetNodes(HighlightType.Hover);
            }
            this.m_nodes.forEach(function (node) {
                if (node.visible) {
                    if (node != _this.m_selectedNode && node != _this.m_hoveredNode)
                        node.setHighlightForEdges(HighlightType.None);
                    var nr = node.prepare();
                    needsRender = needsRender || nr;
                }
            });
            this.m_edgeBatches.forEach(function (batch) {
                var nr = batch.prepare();
                needsRender = needsRender || nr;
            });
            if (needsRender)
                this.m_renderer.render(this.m_stage);
        };
        Renderer.prototype.reshape = function () {
            this.layout();
            this.m_stage.position.set(this.m_container.clientWidth / 2.0, this.m_container.clientHeight / 2.0);
            this.m_renderer.resize(this.m_container.clientWidth, this.m_container.clientHeight);
            this.render(true);
        };
        Renderer.prototype.changeActiveGroupColor = function (newColor) {
            if (this.m_selectedNode) {
                var focusGroup_1 = this.m_selectedNode.groupID;
                this.m_stage.colors[focusGroup_1] = string2color(newColor);
                this.m_nodes.forEach(function (node) {
                    if (node.groupID == focusGroup_1)
                        node.invalidate();
                });
                this.render(false);
            }
        };
        Renderer.prototype.filterEdges = function () {
            var _this = this;
            var result = false;
            this.m_edges.forEach(function (edge) {
                var vis = edge.source.visible && edge.target.visible
                    && edge.weight > _this.m_edgeWeight.min
                    && edge.weight <= _this.m_edgeWeight.max;
                if (vis != edge.visible) {
                    edge.visible = vis;
                    result = true;
                }
            });
            return result;
        };
        Renderer.prototype.filterNodes = function () {
            var _this = this;
            var result = false;
            this.m_nodes.forEach(function (node) {
                var vis = node.weight > _this.m_nodeWeight.min && node.weight <= _this.m_nodeWeight.max;
                if (vis != node.visible) {
                    node.visible = vis;
                    result = true;
                    if (node == _this.m_selectedNode)
                        _this.m_clicked = true;
                }
            });
            return result;
        };
        Renderer.prototype.changeEdgeTreshold = function (values) {
            $("#edgeTreshold").text(values[0] + " .. " + values[1]);
            this.m_edgeWeight.min = values[0];
            this.m_edgeWeight.max = values[1];
            if (this.filterEdges())
                this.render(true);
        };
        Renderer.prototype.changeNodeTreshold = function (values) {
            $("#nodeTreshold").text(values[0] + " .. " + values[1]);
            this.m_nodeWeight.min = values[0];
            this.m_nodeWeight.max = values[1];
            var r1 = this.filterNodes();
            var r2 = this.filterEdges();
            if (r1 && r2)
                this.render(true);
        };
        Renderer.m_maxTextLength = 120.0;
        return Renderer;
    }());
    SciViGraph.Renderer = Renderer;
})(SciViGraph || (SciViGraph = {}));
var SciViGraph;
(function (SciViGraph) {
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(colors, maxEdgeWeight, maxNodeWeight) {
            var _this = _super.call(this) || this;
            _this.colors = colors;
            _this.maxEdgeWeight = maxEdgeWeight;
            _this.maxNodeWeight = maxNodeWeight;
            return _this;
        }
        return Scene;
    }(PIXI.Container));
    SciViGraph.Scene = Scene;
})(SciViGraph || (SciViGraph = {}));
