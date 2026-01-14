import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShoppingCart, Globe } from "lucide-react";
import QuoteDialog from "@/components/QuoteDialog";
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Trusted by 100+ Businesses Worldwide
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Launch Your{" "}
            <span className="gradient-text">eCommerce Store</span>
            <br />
            with Webfluid
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Expert Shopify & WordPress development. Complete store setup, payment gateway integration, and ongoing support—all at unbeatable prices.
          </p>

          {/* Pricing badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="group relative">
              <div className="absolute inset-0 gradient-bg rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex items-center gap-3 px-6 py-4 rounded-2xl glass border-2 border-primary/30 hover:border-primary/60 transition-colors">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">eCommerce Websites</p>
                  <p className="text-2xl font-bold">
                    Starting at <span className="gradient-text">$299</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-brand-orange rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex items-center gap-3 px-6 py-4 rounded-2xl glass border-2 border-accent/30 hover:border-accent/60 transition-colors">
                <Globe className="w-6 h-6 text-accent" />
                <div className="text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Business Websites</p>
                  <p className="text-2xl font-bold">
                    Starting at <span className="bg-gradient-to-r from-accent to-brand-orange bg-clip-text text-transparent">$199</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <QuoteDialog>
              <Button size="lg" className="gradient-bg text-primary-foreground px-8 py-6 text-lg font-semibold hover:opacity-90 transition-opacity group">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </QuoteDialog>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold border-2 hover:bg-muted">
              View Our Work
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-10 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <p className="text-sm text-muted-foreground mb-6">Powered by industry-leading platforms</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
              <div className="flex items-center gap-2">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.337 23.979l7.216-1.561L24 0l-7.163 1.561-1.5 22.418zM12.279 8.384c-.255-.108-.531-.153-.713-.139-.416.031-.642.2-.753.418-.112.22-.097.491.038.734.123.221.34.398.618.518.534.23 1.125.129 1.462-.27.337-.4.275-.981-.143-1.361-.194-.176-.336-.259-.509-.359v.459zm-2.227 5.889c.117-.257.18-.547.18-.854 0-.306-.062-.595-.179-.851-.118-.257-.283-.48-.49-.664-.208-.183-.454-.326-.736-.425-.283-.1-.591-.149-.922-.149-.332 0-.64.05-.923.149-.283.099-.529.242-.736.425-.207.184-.372.407-.49.664-.117.256-.179.545-.179.851 0 .307.062.597.179.854.118.256.283.479.49.663.207.184.453.326.736.426.283.099.591.149.923.149.331 0 .639-.05.922-.149.282-.1.528-.242.736-.426.207-.184.372-.407.49-.663zm-1.179-.042c-.062.136-.148.254-.258.351-.111.098-.243.173-.395.226-.153.053-.322.079-.509.079-.186 0-.356-.026-.509-.079-.152-.053-.284-.128-.395-.226-.11-.097-.196-.215-.258-.351-.062-.137-.093-.287-.093-.454 0-.168.031-.318.093-.454.062-.136.148-.254.258-.351.111-.097.243-.173.395-.226.153-.053.323-.079.509-.079.187 0 .356.026.509.079.152.053.284.129.395.226.11.097.196.215.258.351.062.136.093.286.093.454 0 .167-.031.317-.093.454z"/>
                </svg>
                <span className="font-semibold">Shopify</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.158 12.786l-2.698 7.84c.806.236 1.657.365 2.54.365 1.047 0 2.051-.181 2.986-.517-.024-.039-.046-.078-.065-.121l-2.763-7.567zm-3.836-1.219c0-.263.015-.52.043-.773l-4.871 1.42c-.494.144-.95.42-1.284.8l6.112 16.765c1.394-.529 2.68-1.274 3.813-2.197l-3.813-16.015zm9.347-1.324l-4.266 12.41c1.218-.403 2.347-.987 3.355-1.724 1.816-1.328 3.195-3.189 3.922-5.344l-2.011-5.342zm2.232-5.066c-.331-.801-.949-1.442-1.729-1.772l-6.163-2.616c-.389-.165-.805-.249-1.223-.249-.424 0-.84.086-1.233.257L5.39 3.418c-.78.34-1.394.992-1.717 1.8-.323.809-.319 1.703.012 2.508l1.098 2.913 4.871-1.42c.524-1.912 2.26-3.324 4.336-3.324.61 0 1.192.122 1.722.342l2.231-3.014c.402-.543.609-1.21.609-1.895 0-.435-.086-.86-.251-1.251l.35.343z"/>
                </svg>
                <span className="font-semibold">WordPress</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.146 11.926c-.063.068-.074.128-.064.203.031.254.152.482.354.656.282.244.665.339 1.038.268.325-.062.619-.247.816-.516.178-.243.27-.54.259-.844-.01-.274-.111-.536-.286-.752-.198-.244-.48-.41-.789-.465-.308-.055-.627.005-.894.167-.245.149-.433.385-.513.659-.043.145-.056.295-.043.44l.122.184zm1.021 2.67c-.306.018-.619-.03-.903-.138-.313-.119-.593-.312-.815-.561-.22-.247-.38-.54-.469-.858-.083-.295-.104-.604-.062-.908.052-.378.204-.737.437-1.037.252-.325.59-.573.973-.712.35-.127.727-.175 1.099-.138.4.039.781.181 1.106.408.377.263.664.635.828 1.063.147.383.189.798.123 1.203-.082.503-.316.97-.672 1.333-.382.39-.883.648-1.422.738-.076.012-.152.02-.223.024v-.417zm5.888-4.396l.006-.057c.104-.739.575-1.38 1.24-1.692.372-.175.782-.253 1.187-.227.408.026.803.152 1.148.366.39.241.705.58.913.984.185.36.278.762.27 1.167-.008.368-.107.729-.29 1.048-.165.288-.393.538-.666.729-.334.233-.725.38-1.131.426-.363.041-.731.006-1.082-.103-.436-.135-.828-.388-1.133-.729-.29-.323-.486-.718-.567-1.139-.055-.283-.067-.571-.035-.858l.14.085zm1.039 2.428c.211.102.44.166.673.19.41.041.826-.039 1.186-.228.335-.176.61-.446.793-.778.169-.306.252-.652.243-.999-.009-.316-.098-.625-.261-.895-.178-.296-.437-.535-.746-.691-.281-.141-.595-.212-.911-.207-.353.006-.698.103-1.003.281-.337.197-.609.489-.78.838-.153.312-.22.66-.197 1.006.025.39.165.768.404 1.08.233.304.539.542.899.693v-.29zm4.762-2.428l.005-.057c.104-.739.576-1.38 1.24-1.692.373-.175.783-.253 1.188-.227.408.026.802.152 1.147.366.39.241.706.58.914.984.185.36.277.762.269 1.167-.008.368-.107.729-.289 1.048-.166.288-.394.538-.666.729-.335.233-.726.38-1.132.426-.362.041-.731.006-1.081-.103-.436-.135-.829-.388-1.134-.729-.289-.323-.485-.718-.567-1.139-.054-.283-.067-.571-.034-.858l.14.085zm1.039 2.428c.21.102.439.166.672.19.411.041.827-.039 1.187-.228.335-.176.61-.446.792-.778.17-.306.253-.652.244-.999-.01-.316-.099-.625-.262-.895-.177-.296-.436-.535-.745-.691-.282-.141-.596-.212-.912-.207-.352.006-.697.103-1.002.281-.337.197-.61.489-.781.838-.152.312-.22.66-.196 1.006.024.39.164.768.403 1.08.234.304.54.542.9.693v-.29z"/>
                </svg>
                <span className="font-semibold">WooCommerce</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 4h4v16H4V4zm6 0h4v16h-4V4zm6 0h4v16h-4V4z"/>
                </svg>
                <span className="font-semibold">Elementor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-subtle">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
